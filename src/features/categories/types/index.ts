import { z } from "zod";

export type Category = {
  id: number;
  name: string;
  description: string | null;
  wordCount?: number;
  createdAt: string;
  updatedAt: string;
};

export type CategoryListResponse = {
  data: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ListCategoriesParams = {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "name" | "updatedAt";
  sortOrder?: "asc" | "desc";
};

export type CategoryWordItem = {
  id: number;
  word: string;
  meaning: string | null;
  ipa: string | null;
  frequency: number;
  data: Record<string, unknown> | null;
  provider: string | null;
};

export type CategoryWordsPagination = {
  data: CategoryWordItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type CategoryDetail = {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  words: CategoryWordsPagination;
};

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
};

export type UpdateCategoryInput = {
  name: string;
  description?: string | null;
};

export const createCategorySchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, t("categoryNameRequired"))
      .max(255, t("categoryNameMax")),
    description: z
      .string()
      .max(1000, t("categoryDescriptionMax"))
      .optional()
      .or(z.literal("")),
  });

export type CategoryFormValues = z.infer<
  ReturnType<typeof createCategorySchema>
>;
