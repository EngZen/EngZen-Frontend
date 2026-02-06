import type { Metadata } from "next";
import { CategoryDetailPage } from "@/features/categories/components/category-detail-page";

export const metadata: Metadata = {
  title: "Category Details | EngZen",
  description: "Manage words inside your category",
};

export default function CategoryDetailRoutePage({
  params,
}: {
  params: { id: string };
}) {
  const categoryId = Number(params.id);
  return <CategoryDetailPage categoryId={categoryId} />;
}
