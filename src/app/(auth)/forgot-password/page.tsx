import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | EngZen",
  description: "Reset your EngZen account password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
