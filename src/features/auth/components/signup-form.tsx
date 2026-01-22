"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
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
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useAuth } from "../hooks/use-auth";
import { createSignUpSchema, type SignUpInput } from "../types";
import { SocialAuth } from "./social-auth";

export function SignUpForm() {
  const { signUp, isSigningUp } = useAuth();
  const t = useTranslations("Auth.SignUp");
  const tValidation = useTranslations("Common.Validation");

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    number: false,
  });

  const form = useForm<SignUpInput>({
    resolver: zodResolver(createSignUpSchema((key) => tValidation(key))),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchPassword = form.watch("password");

  useEffect(() => {
    setPasswordStrength({
      length: (watchPassword || "").length >= 8,
      uppercase: /[A-Z]/.test(watchPassword || ""),
      number: /[0-9]/.test(watchPassword || ""),
    });
  }, [watchPassword]);

  const onSubmit = (data: SignUpInput) => {
    signUp(data);
  };

  const StrengthItem = ({ label, met }: { label: string; met: boolean }) => (
    <div
      className={cn(
        "flex items-center gap-2 text-xs transition-colors",
        met ? "text-green-500" : "text-muted-foreground",
      )}
    >
      {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {label}
    </div>
  );

  return (
    <Card className="w-full max-w-md mx-auto rounded-none border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("firstName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        autoComplete="given-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("lastName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        autoComplete="family-name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("password")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                    <StrengthItem
                      label={t("strength.minChars")}
                      met={passwordStrength.length}
                    />
                    <StrengthItem
                      label={t("strength.uppercase")}
                      met={passwordStrength.uppercase}
                    />
                    <StrengthItem
                      label={t("strength.number")}
                      met={passwordStrength.number}
                    />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSigningUp}>
              {isSigningUp ? t("submitting") : t("submit")}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">
              {t("socialTitle")}
            </span>
          </div>
        </div>
        <SocialAuth />
      </CardContent>
      <CardFooter className="flex flex-wrap items-center justify-center gap-2">
        <div className="text-sm text-muted-foreground">
          {t("alreadyHaveAccount")}{" "}
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
