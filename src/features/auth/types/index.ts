import { z } from "zod";

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t("email")),
    password: z.string().min(1, t("passwordRequired")),
    rememberMe: z.boolean(),
  });

export const createSignUpSchema = (t: (key: string) => string) =>
  z
    .object({
      firstName: z.string().min(2, t("firstNameMin")),
      lastName: z.string().min(2, t("lastNameMin")),
      email: z.string().email(t("email")),
      password: z
        .string()
        .min(8, t("passwordMin"))
        .regex(/[A-Z]/, t("passwordUppercase"))
        .regex(/[0-9]/, t("passwordNumber")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMatch"),
      path: ["confirmPassword"],
    });

export const createForgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t("email")),
  });

export const createResetPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      password: z
        .string()
        .min(8, t("passwordMin"))
        .regex(/[A-Z]/, t("passwordUppercase"))
        .regex(/[0-9]/, t("passwordNumber")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordMatch"),
      path: ["confirmPassword"],
    });

export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;
export type SignUpInput = z.infer<ReturnType<typeof createSignUpSchema>>;
export type ForgotPasswordInput = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;
export type ResetPasswordInput = z.infer<
  ReturnType<typeof createResetPasswordSchema>
>;
