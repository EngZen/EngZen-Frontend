"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, type User } from "../services/auth-service";
import type { LoginInput, SignUpInput } from "../types";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTranslations("Common");
  const tAuth = useTranslations("Auth");

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;
      if (!token) return null;
      try {
        return await authService.getCurrentUser();
      } catch {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
        }
        return null;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    meta: {
      errorMessage: tAuth("Login.authError"),
    },
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", data.accessToken);
        document.cookie = `access_token=${data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }
      queryClient.setQueryData(["auth-user"], data.user);
      router.push("/dashboard"); // Or wherever you want to redirect
      toast.success(t("success.default"));
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (data: SignUpInput) => authService.signUp(data),
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", data.accessToken);
        document.cookie = `access_token=${data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      }
      queryClient.setQueryData(["auth-user"], data.user);
      router.push("/onboarding"); // After signup, maybe onboarding
      toast.success(t("success.default"));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        document.cookie =
          "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      queryClient.setQueryData(["auth-user"], null);
      queryClient.clear();
      router.push("/login");
      toast.success(t("success.default"));
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    signUp: signUpMutation.mutate,
    isSigningUp: signUpMutation.isPending,
    signUpError: signUpMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
