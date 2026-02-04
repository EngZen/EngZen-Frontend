import { apiClient } from "@/lib/api-client";
import type {
  CreateWordInput,
  ListWordsParams,
  UpdateWordInput,
  Word,
  WordListResponse,
} from "../types";

function buildListParams(params?: ListWordsParams): Record<string, string> | undefined {
  if (!params) return undefined;

  const result: Record<string, string> = {};
  if (params.word) result.word = params.word;
  if (params.page) result.page = String(params.page);
  if (params.limit) result.limit = String(params.limit);
  if (params.sortBy) result.sortBy = params.sortBy;
  if (params.sortOrder) result.sortOrder = params.sortOrder;
  if (params.categoryIds && params.categoryIds.length > 0) {
    result.categoryIds = params.categoryIds.join(",");
  }

  return result;
}

export const wordsService = {
  list: async (params?: ListWordsParams): Promise<WordListResponse> => {
    return apiClient<WordListResponse>("/api/words", {
      params: buildListParams(params),
    });
  },

  get: async (id: number): Promise<Word> => {
    return apiClient<Word>(`/api/words/${id}`);
  },

  create: async (data: CreateWordInput): Promise<Word> => {
    return apiClient<Word>("/api/words", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: number, data: UpdateWordInput): Promise<Word> => {
    return apiClient<Word>(`/api/words/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<void> => {
    return apiClient(`/api/words/${id}`, {
      method: "DELETE",
    });
  },
};
