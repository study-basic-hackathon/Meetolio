export interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  jobTitle?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  profileImageUrl?: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
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
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  company?: string;
  jobTitle?: string;
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
