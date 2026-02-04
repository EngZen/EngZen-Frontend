import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/logo";

export const AuthDescription = () => {
  const t = useTranslations("Common");

  return (
    <div className="relative h-full w-full space-y-4 bg-primary p-6 text-primary-foreground">
      <div className="flex items-center gap-2">
        <Logo />
        <h1 className="font-bold text-3xl tracking-tight">{t("brand")}</h1>
      </div>
      <p className="text-sm">{t("description")}</p>
      <ul className="space-y-3 font-bold">
        <li className="text-sm">✓ {t("desc_1")}</li>
        <li className="text-sm">✓ {t("desc_2")}</li>
        <li className="text-sm">✓ {t("desc_3")}</li>
        <li className="text-sm">✓ {t("desc_4")}</li>
      </ul>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
        <p className="text-sm">{t("madeBy")}</p>
      </div>
    </div>
  );
};
