import type React from "react";
import { useTranslations } from "next-intl";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Common");

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{t("brand")}</h1>
          <p className="text-muted-foreground mt-2">{t("slogan")}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
