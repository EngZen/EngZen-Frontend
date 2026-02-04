"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppLoading } from "@/components/providers/loading-provider";
import { useTranslations } from "next-intl";
import { useWordList } from "@/features/words/hooks/use-words";
import { useCategoryList } from "@/features/categories/hooks/use-categories";
import { useSearchParams } from "next/navigation";
import type { FlashcardMode } from "../types";

const DEFAULT_LIMIT = 200;

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function FlashcardsPage() {
  const t = useTranslations("Flashcards");
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<FlashcardMode>("all");
  const [categoryId, setCategoryId] = useState<string>("");
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    const fromQuery = searchParams.get("categoryId");
    if (fromQuery) {
      setMode("category");
      setCategoryId(fromQuery);
    }
  }, [searchParams]);

  const categoriesQuery = useCategoryList({
    page: 1,
    limit: 200,
    sortBy: "name",
    sortOrder: "asc",
  });

  const listQuery = useWordList({
    page: 1,
    limit: DEFAULT_LIMIT,
    categoryIds:
      mode === "category" && categoryId ? [Number(categoryId)] : undefined,
  });

  useAppLoading([categoriesQuery.isFetching, listQuery.isFetching]);

  const rawWords = listQuery.data?.data ?? [];
  const words = useMemo(() => {
    const shuffled = shuffleArray(rawWords);
    return seed === 0 ? rawWords : shuffled;
  }, [rawWords, seed]);

  const current = words[index];
  const total = words.length;

  const handleNext = () => {
    setRevealed(false);
    setIndex((prev) => (total === 0 ? 0 : (prev + 1) % total));
  };

  const handlePrev = () => {
    setRevealed(false);
    setIndex((prev) => {
      if (total === 0) return 0;
      return prev === 0 ? total - 1 : prev - 1;
    });
  };

  const handleShuffle = () => {
    setIndex(0);
    setRevealed(false);
    setSeed((prev) => prev + 1);
  };

  const handleModeChange = (value: FlashcardMode) => {
    setMode(value);
    setIndex(0);
    setRevealed(false);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setIndex(0);
    setRevealed(false);
  };

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("controls")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {t("modeLabel")}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={mode === "all" ? "default" : "outline"}
                  onClick={() => handleModeChange("all")}
                >
                  {t("modeAll")}
                </Button>
                <Button
                  type="button"
                  variant={mode === "category" ? "default" : "outline"}
                  onClick={() => handleModeChange("category")}
                >
                  {t("modeCategory")}
                </Button>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {t("categoryLabel")}
              </span>
              <select
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={categoryId}
                onChange={(event) => handleCategoryChange(event.target.value)}
                disabled={mode !== "category" || categoriesQuery.isLoading}
              >
                <option value="">{t("categoryPlaceholder")}</option>
                {(categoriesQuery.data?.data ?? []).map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                {t("actions")}
              </span>
              <Button type="button" variant="outline" onClick={handleShuffle}>
                {t("shuffle")}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {t("progress", { current: total === 0 ? 0 : index + 1, total })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {listQuery.isError ? (
              <p className="text-sm text-destructive">{t("error")}</p>
            ) : total === 0 ? (
              <p className="text-sm text-muted-foreground">{t("empty")}</p>
            ) : (
              <button
                type="button"
                onClick={() => setRevealed((prev) => !prev)}
                className="flex min-h-[220px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-muted-foreground/40 bg-background px-6 py-10 text-center transition hover:border-primary"
              >
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {revealed ? t("backSide") : t("frontSide")}
                </div>
                <div className="mt-4 text-3xl font-semibold text-foreground">
                  {revealed ? current?.meaning || "-" : current?.word}
                </div>
                {revealed && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    {t("ipaLabel")}: {current?.ipa || "-"}
                  </div>
                )}
                <div className="mt-6 text-xs text-muted-foreground">
                  {t("tapToFlip")}
                </div>
              </button>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button type="button" variant="outline" onClick={handlePrev}>
                {t("prev")}
              </Button>
              <div className="text-xs text-muted-foreground">
                {t("wordMeta", {
                  word: current?.word ?? "-",
                  meaning: current?.meaning ?? "-",
                })}
              </div>
              <Button type="button" variant="outline" onClick={handleNext}>
                {t("next")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
