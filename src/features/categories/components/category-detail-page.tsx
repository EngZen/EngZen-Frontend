"use client";

import { type FormEvent, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAppLoading } from "@/components/providers/loading-provider";
import { Link } from "@/i18n/routing";
import { useWordList } from "@/features/words/hooks/use-words";
import {
  useAddWordsToCategory,
  useCategoryDetail,
  useRemoveWordFromCategory,
} from "../hooks/use-categories";

const WORDS_PAGE_LIMIT = 20;
const ADD_WORDS_LIMIT = 10;

export function CategoryDetailPage({ categoryId }: { categoryId: number }) {
  const t = useTranslations("Categories");

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWords, setSelectedWords] = useState<number[]>([]);

  const detailQuery = useCategoryDetail(categoryId, {
    page,
    limit: WORDS_PAGE_LIMIT,
  });

  const addWordQuery = useWordList({
    word: searchTerm || undefined,
    page: 1,
    limit: ADD_WORDS_LIMIT,
  });

  const addWordsMutation = useAddWordsToCategory({
    onSuccess: () => {
      setSelectedWords([]);
    },
  });

  const removeWordMutation = useRemoveWordFromCategory();

  useAppLoading([
    detailQuery.isFetching,
    addWordQuery.isFetching,
    addWordsMutation.isPending,
    removeWordMutation.isPending,
  ]);

  const category = detailQuery.data;
  const words = category?.words.data ?? [];
  const totalPages = category?.words.totalPages ?? 1;

  const existingWordIds = useMemo(() => {
    return new Set(words.map((word) => word.id));
  }, [words]);

  const availableWords = useMemo(() => {
    const all = addWordQuery.data?.data ?? [];
    return all.filter((word) => !existingWordIds.has(word.id));
  }, [addWordQuery.data?.data, existingWordIds]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
  };

  const handleToggleWord = (wordId: number) => {
    setSelectedWords((prev) => {
      if (prev.includes(wordId)) {
        return prev.filter((id) => id !== wordId);
      }
      return [...prev, wordId];
    });
  };

  const handleAddSelected = () => {
    if (selectedWords.length === 0) return;
    addWordsMutation.mutate({
      categoryId,
      wordIds: selectedWords,
    });
  };

  const handleRemoveWord = (wordId: number) => {
    removeWordMutation.mutate({ categoryId, wordId });
  };

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {category?.name || t("detailTitle")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {category?.description || t("detailDescription")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/categories">{t("backToCategories")}</Link>
            </Button>
            <Button asChild>
              <Link href={`/flashcards?categoryId=${categoryId}`}>
                {t("study")}
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>{t("wordsTitle")}</CardTitle>
              <CardDescription>
                {t("wordsDescription", {
                  total: category?.words.total ?? 0,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {detailQuery.isError ? (
                <p className="text-sm text-destructive">{t("error")}</p>
              ) : words.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("wordsEmpty")}
                </p>
              ) : (
                words.map((word) => (
                  <div
                    key={word.id}
                    className="rounded-lg border border-border bg-background p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold text-foreground">
                          {word.word}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {word.meaning || "-"}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveWord(word.id)}
                      >
                        {t("remove")}
                      </Button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>
                        {t("ipaLabel")}: {word.ipa || "-"}
                      </span>
                      <span>
                        {t("frequencyLabel")}: {word.frequency}
                      </span>
                      {word.provider && (
                        <span>
                          {t("providerLabel")}: {word.provider}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                {t("page")} {page} {t("of")} {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                >
                  {t("prev")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={page >= totalPages}
                >
                  {t("next")}
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("addWordsTitle")}</CardTitle>
              <CardDescription>{t("addWordsDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <Input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder={t("addWordsPlaceholder")}
                />
                <Button type="submit" variant="outline">
                  {t("search")}
                </Button>
              </form>

              {addWordQuery.isError ? (
                <p className="text-sm text-destructive">{t("wordError")}</p>
              ) : availableWords.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("addWordsEmpty")}
                </p>
              ) : (
                <div className="space-y-2">
                  {availableWords.map((word) => (
                    <label
                      key={word.id}
                      className="flex items-start gap-3 rounded-lg border border-border bg-background p-3"
                    >
                      <Checkbox
                        checked={selectedWords.includes(word.id)}
                        onCheckedChange={() => handleToggleWord(word.id)}
                      />
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-foreground">
                          {word.word}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {word.meaning || "-"}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="button"
                className="w-full"
                onClick={handleAddSelected}
                disabled={selectedWords.length === 0}
              >
                {addWordsMutation.isPending
                  ? t("addingWords")
                  : t("addSelected")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
