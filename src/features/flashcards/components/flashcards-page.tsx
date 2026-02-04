"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useAppLoading } from "@/components/providers/loading-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategoryList } from "@/features/categories/hooks/use-categories";
import { useWordList } from "@/features/words/hooks/use-words";
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

type FlashcardControlsProps = {
  mode: FlashcardMode;
  categoryId: string;
  categories: { id: number; name: string }[];
  isCategoriesLoading: boolean;
  onModeChange: (value: FlashcardMode) => void;
  onCategoryChange: (value: string) => void;
  onShuffle: () => void;
};

function FlashcardControls({
  mode,
  categoryId,
  categories,
  isCategoriesLoading,
  onModeChange,
  onCategoryChange,
  onShuffle,
}: FlashcardControlsProps) {
  const t = useTranslations("Flashcards");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("controls")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="font-medium text-muted-foreground text-xs">
            {t("modeLabel")}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={mode === "all" ? "default" : "outline"}
              onClick={() => onModeChange("all")}
            >
              {t("modeAll")}
            </Button>
            <Button
              type="button"
              variant={mode === "category" ? "default" : "outline"}
              onClick={() => onModeChange("category")}
            >
              {t("modeCategory")}
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <span className="font-medium text-muted-foreground text-xs">
            {t("categoryLabel")}
          </span>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={categoryId}
            onChange={(event) => onCategoryChange(event.target.value)}
            disabled={mode !== "category" || isCategoriesLoading}
          >
            <option value="">{t("categoryPlaceholder")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <span className="font-medium text-muted-foreground text-xs">
            {t("actions")}
          </span>
          <Button type="button" variant="outline" onClick={onShuffle}>
            {t("shuffle")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

type FlashcardViewerProps = {
  current?: {
    word?: string;
    meaning?: string | null;
    ipa?: string | null;
  };
  total: number;
  index: number;
  revealed: boolean;
  isError: boolean;
  onFlip: () => void;
  onPrev: () => void;
  onNext: () => void;
};

function FlashcardViewer({
  current,
  total,
  index,
  revealed,
  isError,
  onFlip,
  onPrev,
  onNext,
}: FlashcardViewerProps) {
  const t = useTranslations("Flashcards");

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("progress", { current: total === 0 ? 0 : index + 1, total })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isError ? (
          <p className="text-destructive text-sm">{t("error")}</p>
        ) : total === 0 ? (
          <p className="text-muted-foreground text-sm">{t("empty")}</p>
        ) : (
          <button
            type="button"
            onClick={onFlip}
            className="flex min-h-[220px] w-full flex-col items-center justify-center rounded-xl border border-muted-foreground/40 border-dashed bg-background px-6 py-10 text-center transition hover:border-primary"
          >
            <div className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
              {revealed ? t("backSide") : t("frontSide")}
            </div>
            <div className="mt-4 font-semibold text-3xl text-foreground">
              {revealed ? current?.meaning || "-" : current?.word}
            </div>
            {revealed && (
              <div className="mt-3 text-muted-foreground text-sm">
                {t("ipaLabel")}: {current?.ipa || "-"}
              </div>
            )}
            <div className="mt-6 text-muted-foreground text-xs">
              {t("tapToFlip")}
            </div>
          </button>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button type="button" variant="outline" onClick={onPrev}>
            {t("prev")}
          </Button>
          <div className="text-muted-foreground text-xs">
            {t("wordMeta", {
              word: current?.word ?? "-",
              meaning: current?.meaning ?? "-",
            })}
          </div>
          <Button type="button" variant="outline" onClick={onNext}>
            {t("next")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
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
    if (seed === 0) return rawWords;
    return shuffleArray(rawWords);
  }, [rawWords, seed]);

  const total = words.length;
  const current = words[index];

  const handleNext = () => {
    setRevealed(false);
    setIndex((prev) => (total === 0 ? 0 : (prev + 1) % total));
  };

  const handlePrev = () => {
    setRevealed(false);
    setIndex((prev) => (total === 0 ? 0 : prev === 0 ? total - 1 : prev - 1));
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
          <h1 className="font-bold text-3xl text-foreground tracking-tight">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>

        <FlashcardControls
          mode={mode}
          categoryId={categoryId}
          categories={categoriesQuery.data?.data ?? []}
          isCategoriesLoading={categoriesQuery.isLoading}
          onModeChange={handleModeChange}
          onCategoryChange={handleCategoryChange}
          onShuffle={handleShuffle}
        />

        <FlashcardViewer
          current={current}
          total={total}
          index={index}
          revealed={revealed}
          isError={listQuery.isError}
          onFlip={() => setRevealed((prev) => !prev)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}
