"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authService } from "../services/auth-service";
import { type ForgotPasswordInput, createForgotPasswordSchema } from "../types";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("Auth.ForgotPassword");
  const tValidation = useTranslations("Common.Validation");

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(
      createForgotPasswordSchema((key) => tValidation(key)),
    ),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data);
      setIsSubmitted(true);
    } catch {
      toast.error(t("error"));
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className="w-full max-w-md mx-auto rounded-none border-0">
        <CardHeader>
          <div className="flex justify-center mb-4 text-green-500">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {t("successTitle")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("successDescription", { email: form.getValues("email") })}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            {t("backToLogin")}
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto rounded-none border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t("submitting") : t("submit")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm text-muted-foreground">
          {t("remembered")}{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            {t("login")}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
