"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { wordsService } from "../services/words-service";
import type { CreateWordInput, ListWordsParams, WordListResponse } from "../types";

export function useWordList(filters: ListWordsParams) {
  const t = useTranslations("Vocabulary");

  return useQuery<WordListResponse>({
    queryKey: ["words", filters],
    queryFn: () => wordsService.list(filters),
    meta: {
      errorMessage: t("error"),
    },
  });
}

export function useCreateWord(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const t = useTranslations("Vocabulary");

  return useMutation({
    mutationFn: (data: CreateWordInput) => wordsService.create(data),
    meta: {
      errorMessage: t("error"),
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words"] });
      toast.success(t("createSuccess"));
      options?.onSuccess?.();
    },
  });
}
