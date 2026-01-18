"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService, type User } from "@/lib/auth-service";
import type { LoginInput, SignUpInput } from "@/lib/validations/auth";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

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
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", data.accessToken);
      }
      queryClient.setQueryData(["auth-user"], data.user);
      router.push("/dashboard"); // Or wherever you want to redirect
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (data: SignUpInput) => authService.signUp(data),
    onSuccess: (data) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", data.accessToken);
      }
      queryClient.setQueryData(["auth-user"], data.user);
      router.push("/onboarding"); // After signup, maybe onboarding
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
      queryClient.setQueryData(["auth-user"], null);
      queryClient.clear();
      router.push("/login");
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
