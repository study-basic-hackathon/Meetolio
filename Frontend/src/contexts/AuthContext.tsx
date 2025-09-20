import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { AuthState, User, LoginForm, RegisterForm } from "../types";

const STORAGE_KEYS = {
  token: "access_token",
  user: "user_info",
} as const;

const getToken = () => localStorage.getItem(STORAGE_KEYS.token);
const setToken = (t: string) => localStorage.setItem(STORAGE_KEYS.token, t);
const setUser = (u: User) =>
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(u));
const clearToken = () => {
  localStorage.removeItem(STORAGE_KEYS.token);
  localStorage.removeItem(STORAGE_KEYS.user);
};

// 型定義
type AuthAction =
  | { type: "LOGIN_PAGE"; payload: User | null }
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "REGISTER_START" }
  | { type: "REGISTER_SUCCESS"; payload: User }
  | { type: "REGISTER_FAILURE"; payload: string }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "CLEAR_ERROR" }
  | { type: "DELETE_ACCOUNT_SUCCESS" }
  | { type: "DELETE_ACCOUNT_FAILURE"; payload: string }
  | { type: "CHANGE_PASSWORD_SUCCESS" }
  | { type: "CHANGE_PASSWORD_FAILURE"; payload: string }
  | { type: "CLEAR_JUST_LOGGED_IN" };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  justLoggedIn: false,
  isAuthReady: false,
};

// ReducerでlocalStorageの保存はやらない
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_PAGE":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        justLoggedIn: false,
        isAuthReady: true,
      };
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        justLoggedIn: true,
        isAuthReady: true,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        justLoggedIn: false,
        isAuthReady: true,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        justLoggedIn: false,
        isAuthReady: true,
      };
    case "REGISTER_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "REGISTER_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        justLoggedIn: true,
        isAuthReady: true,
      };
    case "REGISTER_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        justLoggedIn: false,
        isAuthReady: true,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "CLEAR_JUST_LOGGED_IN":
      return {
        ...state,
        justLoggedIn: false,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "DELETE_ACCOUNT_SUCCESS":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        justLoggedIn: false,
      };
    case "DELETE_ACCOUNT_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "CHANGE_PASSWORD_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case "CHANGE_PASSWORD_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

//  「認証に必要なすべての機能＋状態」の型
interface AuthContextType extends AuthState {
  login: (formData: LoginForm) => Promise<void>;
  register: (formData: RegisterForm) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  clearJustLoggedIn: () => void;
  updateUser: (user: User) => void;
  deleteAccount: (password: string) => Promise<boolean>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
  getToken: () => string | null;
}

// グローバルに使える認証箱
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 自作のHooks
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// propsはchildren
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // localStorageのトークンをサーバーで検証する
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();

      if (!token) {
        clearToken();
        dispatch({ type: "LOGIN_PAGE", payload: null });
        return;
      }

      try {
        const res = await fetch("/api/account/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          clearToken();
          dispatch({ type: "LOGIN_PAGE", payload: null });
          return;
        }

        const userResponse: any = await res.json();

        // バックエンドのAccountResponseDtoをフロントエンドのUser型にマッピング
        const user: User = {
          id: String(userResponse.id), // IntegerをStringに変換
          email: userResponse.email,
          createdAt: new Date(userResponse.createdAt),
          updatedAt: new Date(userResponse.updatedAt),
        };

        setUser(user);
        dispatch({ type: "LOGIN_PAGE", payload: user });
      } catch {
        clearToken();
        dispatch({ type: "LOGIN_PAGE", payload: null });
      }
    };

    checkAuth();
  }, []); // アプリを起動したとき初めだけ作動するために[]をつけている

  type LoginResponse = { accessToken: string };

  const login = async (formData: LoginForm) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        // バックエンドからのエラーメッセージを取得
        let errorMessage = "ログインに失敗しました";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // JSONパースに失敗した場合はデフォルトメッセージを使用
        }
        throw new Error(errorMessage);
      }

      // バックエンドから返るレスポンスを取得
      const data: LoginResponse = await res.json();

      // トークンを｀保存
      setToken(data.accessToken);

      // トークンで本人情報を取得
      const meCheck = await fetch("/api/account/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });
      if (!meCheck.ok) throw new Error("ユーザー情報の取得に失敗しました");

      const userResponse: any = await meCheck.json();

      // バックエンドのAccountResponseDtoをフロントエンドのUser型にマッピング
      const user: User = {
        id: String(userResponse.id), // IntegerをStringに変換
        email: userResponse.email,
        createdAt: new Date(userResponse.createdAt),
        updatedAt: new Date(userResponse.updatedAt),
      };

      setUser(user);

      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error) {
      console.log(error);
      clearToken();
      const errorMessage =
        error instanceof Error ? error.message : "ログインに失敗しました";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
    }
  };

  const register = async (formData: RegisterForm) => {
    dispatch({ type: "REGISTER_START" });

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        throw new Error("登録に失敗しました");
      }

      clearToken();

      dispatch({ type: "LOGIN_PAGE", payload: null });
      return true;
    } catch (error) {
      console.log(error);
      clearToken();
      dispatch({ type: "REGISTER_FAILURE", payload: "登録に失敗しました" });
      return false;
    }
  };

  const logout = () => {
    clearToken();
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const clearJustLoggedIn = () => {
    dispatch({ type: "CLEAR_JUST_LOGGED_IN" });
  };

  const updateUser = (user: User) => {
    setUser(user); // localStorageも更新
    dispatch({ type: "UPDATE_USER", payload: user });
  };

  const deleteAccount = async (password: string): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" }); // ローディング状態に

    try {
      const token = getToken();
      const res = await fetch("/api/account/me", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        throw new Error("アカウント削除に失敗しました");
      }

      clearToken();
      dispatch({ type: "DELETE_ACCOUNT_SUCCESS" });
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "アカウント削除に失敗しました";
      dispatch({ type: "DELETE_ACCOUNT_FAILURE", payload: errorMessage });
      return false;
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" }); // ローディング状態に

    try {
      const token = getToken();
      const res = await fetch("/api/account/me/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        throw new Error("パスワード変更に失敗しました");
      }

      dispatch({ type: "CHANGE_PASSWORD_SUCCESS" });
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "パスワード変更に失敗しました";
      dispatch({ type: "CHANGE_PASSWORD_FAILURE", payload: errorMessage });
      return false;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    clearJustLoggedIn,
    updateUser,
    deleteAccount,
    changePassword,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
