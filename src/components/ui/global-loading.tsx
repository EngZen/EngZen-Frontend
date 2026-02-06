"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface GlobalLoadingProps {
  isLoading: boolean;
}

export function GlobalLoading({ isLoading }: GlobalLoadingProps) {
  const t = useTranslations("Common");
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="animate-pulse font-medium text-muted-foreground text-sm">
          {t("loading")}
        </p>
      </div>
    </div>
  );
}
