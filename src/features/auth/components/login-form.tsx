"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useAuth } from "../hooks/use-auth";
import { type LoginInput, createLoginSchema } from "../types";
import { SocialAuth } from "./social-auth";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const t = useTranslations("Auth.Login");
  const tValidation = useTranslations("Common.Validation");

  const form = useForm<LoginInput>({
    resolver: zodResolver(createLoginSchema((key) => tValidation(key))),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginInput) => {
    login(data);
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-none border-0">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
        <CardDescription className="text-sm">
          {t("description")}
        </CardDescription>
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
                  <div className="flex items-center justify-between">
                    <FormLabel>{t("password")}</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {t("forgotPassword")}
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 text-left">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("rememberMe")}</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? t("submitting") : t("submit")}
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
          {t("noAccount")}{" "}
          <Link
            href="/register"
            className="text-primary hover:underline font-medium"
          >
            {t("signUp")}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
