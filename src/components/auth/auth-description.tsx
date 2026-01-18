import { useTranslations } from "next-intl";
import { Logo } from "../ui/logo";

export const AuthDescription = () => {
  const t = useTranslations("Common");

  return (
    <div className="space-y-4 bg-primary h-full w-full p-6 text-primary-foreground relative">
      <div className="flex items-center gap-2">
        <Logo />
        <h1 className="text-3xl font-bold tracking-tight">{t("brand")}</h1>
      </div>
      <p className="text-sm">{t("description")}</p>
      <ul className="space-y-3 font-bold">
        <li className="text-sm">✓ {t("desc_1")}</li>
        <li className="text-sm">✓ {t("desc_2")}</li>
        <li className="text-sm">✓ {t("desc_3")}</li>
        <li className="text-sm">✓ {t("desc_4")}</li>
      </ul>
      <div className="flex items-center gap-2 absolute bottom-4 left-1/2 -translate-x-1/2">
        <p className="text-sm">{t("madeBy")}</p>
      </div>
    </div>
  );
};
