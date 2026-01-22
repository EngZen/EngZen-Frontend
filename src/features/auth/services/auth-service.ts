import { apiClient } from "@/lib/api-client";
import type {
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  SignUpInput,
} from "../types";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    return apiClient<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  signUp: async (data: SignUpInput): Promise<AuthResponse> => {
    return apiClient<AuthResponse>("/api/sign-up", {
      method: "POST",
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
      }),
    });
  },

  logout: async (): Promise<void> => {
    return apiClient("/auth/logout", {
      method: "POST",
    });
  },

  forgotPassword: async (
    data: ForgotPasswordInput,
  ): Promise<{ message: string }> => {
    return apiClient("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  resetPassword: async (
    data: ResetPasswordInput & { token: string },
  ): Promise<{ message: string }> => {
    return apiClient("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  getCurrentUser: async (): Promise<User> => {
    return apiClient<User>("/auth/me");
  },

  socialLogin: async (provider: "google" | "facebook"): Promise<void> => {
    // Usually this redirects to a backend URL
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}`;
  },
};
