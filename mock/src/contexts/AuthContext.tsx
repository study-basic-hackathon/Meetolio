import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { AuthState, User, LoginForm, RegisterForm } from "../types";

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "REGISTER_START" }
  | { type: "REGISTER_SUCCESS"; payload: User }
  | { type: "REGISTER_FAILURE"; payload: string }
  | { type: "CLEAR_ERROR" };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
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
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
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
      };
    case "REGISTER_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (formData: LoginForm) => Promise<void>;
  register: (formData: RegisterForm) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (formData: LoginForm) => {
    dispatch({ type: "LOGIN_START" });

    try {
      // モック実装：実際のAPI呼び出しに置き換える
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ダミーユーザーデータ
      const mockUser: User = {
        id: "1",
        email: formData.email,
        name: "テストユーザー",
        company: "テスト株式会社",
        jobTitle: "エンジニア",
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      dispatch({ type: "LOGIN_SUCCESS", payload: mockUser });
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE", payload: "ログインに失敗しました" });
    }
  };

  const register = async (formData: RegisterForm) => {
    dispatch({ type: "REGISTER_START" });

    try {
      // モック実装：実際のAPI呼び出しに置き換える
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ダミーユーザーデータ
      const mockUser: User = {
        id: "1",
        email: formData.email,
        name: formData.name,
        company: formData.company,
        jobTitle: formData.jobTitle,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      };

      dispatch({ type: "REGISTER_SUCCESS", payload: mockUser });
    } catch (error) {
      dispatch({ type: "REGISTER_FAILURE", payload: "登録に失敗しました" });
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
