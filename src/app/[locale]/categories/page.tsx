import type { Metadata } from "next";
import { CategoriesPage } from "@/features/categories/components/categories-page";

export const metadata: Metadata = {
  title: "Categories | EngZen",
  description: "Manage your vocabulary categories",
};

export default function CategoriesRoutePage() {
  return <CategoriesPage />;
}
