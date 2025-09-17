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
  | { type: "CLEAR_ERROR" }
  | { type: "CLEAR_JUST_LOGGED_IN" };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  justLoggedIn: false,
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
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        justLoggedIn: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        justLoggedIn: false,
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
      };
    case "REGISTER_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        justLoggedIn: false,
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

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    clearJustLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
