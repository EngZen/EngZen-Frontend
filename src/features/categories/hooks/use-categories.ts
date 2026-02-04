"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { categoriesService } from "../services/categories-service";
import type {
  CategoryDetail,
  CategoryListResponse,
  CreateCategoryInput,
  ListCategoriesParams,
  UpdateCategoryInput,
} from "../types";

export function useCategoryList(filters: ListCategoriesParams) {
  const t = useTranslations("Categories");

  return useQuery<CategoryListResponse>({
    queryKey: ["categories", filters],
    queryFn: () => categoriesService.list(filters),
    meta: {
      errorMessage: t("error"),
    },
  });
}

export function useCategoryDetail(
  id: number,
  params: { page?: number; limit?: number },
) {
  const t = useTranslations("Categories");
  return useQuery<CategoryDetail>({
    queryKey: [
      "category-detail",
      id,
      params.page ?? null,
      params.limit ?? null,
    ],
    queryFn: () => categoriesService.getDetail(id, params),
    enabled: Number.isFinite(id),
    meta: {
      errorMessage: t("error"),
    },
  });
}

export function useCreateCategory(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const t = useTranslations("Categories");

  return useMutation({
    mutationFn: (data: CreateCategoryInput) => categoriesService.create(data),
    meta: {
      errorMessage: t("error"),
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(t("createSuccess"));
      options?.onSuccess?.();
    },
  });
}

export function useUpdateCategory(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const t = useTranslations("Categories");

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateCategoryInput;
    }) => categoriesService.update(id, data),
    meta: {
      errorMessage: t("error"),
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category-detail"] });
      toast.success(t("updateSuccess"));
      options?.onSuccess?.();
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const t = useTranslations("Categories");

  return useMutation({
    mutationFn: (id: number) => categoriesService.delete(id),
    meta: {
      errorMessage: t("error"),
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success(t("deleteSuccess"));
    },
  });
}

export function useAddWordsToCategory(options?: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  const t = useTranslations("Categories");

  return useMutation({
    mutationFn: ({
      categoryId,
      wordIds,
    }: {
      categoryId: number;
      wordIds: number[];
    }) => categoriesService.addWords(categoryId, wordIds),
    meta: {
      errorMessage: t("wordError"),
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-detail"] });
      toast.success(t("addWordsSuccess"));
      options?.onSuccess?.();
    },
  });
}

export function useRemoveWordFromCategory() {
  const queryClient = useQueryClient();
  const t = useTranslations("Categories");

  return useMutation({
    mutationFn: ({
      categoryId,
      wordId,
    }: {
      categoryId: number;
      wordId: number;
    }) => categoriesService.removeWord(categoryId, wordId),
    meta: {
      errorMessage: t("wordError"),
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-detail"] });
      toast.success(t("removeWordSuccess"));
    },
  });
}
