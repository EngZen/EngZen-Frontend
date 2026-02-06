import { apiClient } from "@/lib/api-client";
import type {
  Category,
  CategoryDetail,
  CategoryListResponse,
  CreateCategoryInput,
  ListCategoriesParams,
  UpdateCategoryInput,
} from "../types";

function buildCategoryParams(
  params?: ListCategoriesParams,
): Record<string, string> | undefined {
  if (!params) return undefined;
  const result: Record<string, string> = {};
  if (params.search) result.search = params.search;
  if (params.page) result.page = String(params.page);
  if (params.limit) result.limit = String(params.limit);
  if (params.sortBy) result.sortBy = params.sortBy;
  if (params.sortOrder) result.sortOrder = params.sortOrder;
  return result;
}

export const categoriesService = {
  list: async (
    params?: ListCategoriesParams,
  ): Promise<CategoryListResponse> => {
    return apiClient<CategoryListResponse>("/api/categories", {
      params: buildCategoryParams(params),
    });
  },

  getDetail: async (
    id: number,
    params?: { page?: number; limit?: number },
  ): Promise<CategoryDetail> => {
    const query: Record<string, string> = {};
    if (params?.page) query.page = String(params.page);
    if (params?.limit) query.limit = String(params.limit);
    return apiClient<CategoryDetail>(`/api/categories/${id}`, {
      params: Object.keys(query).length > 0 ? query : undefined,
    });
  },

  create: async (data: CreateCategoryInput): Promise<Category> => {
    return apiClient<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: UpdateCategoryInput): Promise<Category> => {
    return apiClient<Category>(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return apiClient(`/api/categories/${id}`, {
      method: "DELETE",
    });
  },

  addWords: async (
    categoryId: number,
    wordIds: number[],
  ): Promise<{ added: number; skipped: number; totalWords: number }> => {
    return apiClient(`/api/categories/${categoryId}/words`, {
      method: "POST",
      body: JSON.stringify({ wordIds }),
    });
  },

  removeWords: async (
    categoryId: number,
    wordIds: number[],
  ): Promise<{ added: number; skipped: number; totalWords: number }> => {
    return apiClient(`/api/categories/${categoryId}/words`, {
      method: "DELETE",
      body: JSON.stringify({ wordIds }),
    });
  },

  removeWord: async (
    categoryId: number,
    wordId: number,
  ): Promise<{ success: boolean }> => {
    return apiClient(`/api/categories/${categoryId}/words/${wordId}`, {
      method: "DELETE",
    });
  },
};
