import type { Metadata } from "next";
import { FlashcardsPage } from "@/features/flashcards/components/flashcards-page";

export const metadata: Metadata = {
  title: "Flashcards | EngZen",
  description: "Study your vocabulary with flashcards",
};

export default function FlashcardsRoutePage() {
  return <FlashcardsPage />;
}
