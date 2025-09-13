import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthState, User, LoginForm, RegisterForm } from "../types";

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
      localStorage.setItem("user_info", JSON.stringify(action.payload));
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
      localStorage.removeItem("user_info");
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
      localStorage.setItem("user_info", JSON.stringify(action.payload));
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
  register: (formData: RegisterForm) => Promise<void>;
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

  // 初期化時にローカルストレージから状態を復元
  useEffect(() => {
    const checkAuth = async () => {
      const saveUser = localStorage.getItem("user_info");
      if (!saveUser) {
        dispatch({ type: "LOGIN_PAGE", payload: null });
        return;
      }
    };
  });

  const login = async (formData: LoginForm) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        throw new Error("ログインに失敗しました");
      }

      // バックエンドから返るレスポンスを取得
      const data: { accessToken: string } = await res.json();

      // アクセストークンを保存（localStorageやcookieなど）
      localStorage.setItem("user_token", data.accessToken);
      dispatch({ type: "LOGIN_SUCCESS", payload: User });
    } catch (error) {
      console.log(error);
      dispatch({ type: "LOGIN_FAILURE", payload: "ログインに失敗しました" });
    }
  };

  const register = async (formData: RegisterForm) => {
    dispatch({ type: "REGISTER_START" });

    try {
      const res = await fetch("/signup", {
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

      // バックエンドから返るレスポンスを取得
      const data: { accessToken: string } = await res.json();

      // アクセストークンを保存（localStorageやcookieなど）
      localStorage.setItem("meetolio_token", data.accessToken);

      // ダミーユーザーデータ
      const mockUser: User = {
        id: "1",
        email: formData.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dispatch({ type: "REGISTER_SUCCESS", payload: mockUser });
    } catch (error) {
      console.log(error);
      dispatch({ type: "REGISTER_FAILURE", payload: "登録に失敗しました" });
    }
  };

  const logout = () => {
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
