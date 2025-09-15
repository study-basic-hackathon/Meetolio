// 各オブジェクトの定義
export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  nameKana: string;
  nameCardImgUrl?: string;
  occupation?: string;
  company?: string;
  introduction?: string;
  contactInfo: ContactInfo;
  skills: string[];
  interests: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  sns: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    github?: string;
  };
  website?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  justLoggedIn: boolean;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileForm {
  name: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  phone?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
  skills: string[];
  interests: string[];
  isPublic: boolean;
}

export interface ChangeEmailForm {
  currentEmail: string;
  newEmail: string;
  password: string;
}

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface DeleteAccountForm {
  reason: string;
  password: string;
}
