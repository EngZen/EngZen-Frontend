import type { Metadata } from "next";
import { VocabularyPage } from "@/features/words/components/vocabulary-page";

export const metadata: Metadata = {
  title: "Vocabulary | EngZen",
  description: "Manage your vocabulary words",
};

export default function VocabularyRoutePage() {
  return <VocabularyPage />;
}
