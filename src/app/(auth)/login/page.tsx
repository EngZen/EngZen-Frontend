import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login | EngZen",
  description: "Login to your EngZen account",
};

export default function LoginPage() {
  return <LoginForm />;
}
