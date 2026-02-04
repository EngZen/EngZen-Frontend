import { z } from "zod";

export type WordCategory = {
  id: number;
  name: string;
  description: string | null;
};

export type Word = {
  id: number;
  word: string;
  meaning: string | null;
  ipa: string | null;
  frequency: number;
  provider: string | null;
  data: Record<string, unknown> | null;
  categories?: WordCategory[];
  createdId?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type WordListResponse = {
  data: Word[];
  total: number;
  page: number;
  limit: number;
};

export type ListWordsParams = {
  word?: string;
  categoryIds?: number[];
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "word" | "frequency";
  sortOrder?: "asc" | "desc";
};

export type CreateWordInput = {
  word: string;
  meaning?: string;
  ipa?: string;
  frequency?: number;
  data?: Record<string, unknown> | null;
  categoryIds?: number[];
};

export type UpdateWordInput = Partial<CreateWordInput>;

export const createWordSchema = (t: (key: string) => string) =>
  z.object({
    word: z.string().min(1, t("wordRequired")).max(255, t("wordMax")),
    meaning: z.string().optional(),
    ipa: z.string().optional(),
    frequency: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (!value || value.trim().length === 0) return true;
          const numeric = Number(value);
          return !Number.isNaN(numeric) && numeric >= 0 && numeric <= 10;
        },
        { message: t("frequencyRange") },
      ),
  });

export type CreateWordFormValues = z.infer<ReturnType<typeof createWordSchema>>;
