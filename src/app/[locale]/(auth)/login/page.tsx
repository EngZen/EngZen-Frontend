import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Login | EngZen",
  description: "Login to your EngZen account",
};

export default function LoginPage() {
  return <LoginForm />;
}
