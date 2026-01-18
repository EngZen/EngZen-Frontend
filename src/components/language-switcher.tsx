"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "./ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "vi" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="fixed top-4 right-4 border border-border rounded-full px-4"
    >
      {locale === "en" ? "🇻🇳 Tiếng Việt" : "🇺🇸 English"}
    </Button>
  );
}
