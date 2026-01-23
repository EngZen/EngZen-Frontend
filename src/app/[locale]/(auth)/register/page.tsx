import type { Metadata } from "next";
import { SignUpForm } from "@/features/auth/components/signup-form";

export const metadata: Metadata = {
  title: "Sign Up | EngZen",
  description: "Create your EngZen account",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
