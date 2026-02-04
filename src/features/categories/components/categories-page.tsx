"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { type FormEvent, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppLoading } from "@/components/providers/loading-provider";
import { Link } from "@/i18n/routing";
import {
  createCategorySchema,
  type Category,
  type CategoryFormValues,
} from "../types";
import {
  useCategoryList,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "../hooks/use-categories";

const DEFAULT_LIMIT = 12;

export function CategoriesPage() {
  const t = useTranslations("Categories");
  const tValidation = useTranslations("Common.Validation");

  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Category | null>(null);

  const listQuery = useCategoryList({
    search: searchTerm || undefined,
    page,
    limit: DEFAULT_LIMIT,
    sortBy: "name",
    sortOrder: "asc",
  });

  const createForm = useForm<CategoryFormValues>({
    resolver: zodResolver(createCategorySchema((key) => tValidation(key))),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(createCategorySchema((key) => tValidation(key))),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createMutation = useCreateCategory({
    onSuccess: () => {
      createForm.reset();
      setPage(1);
    },
  });

  const updateMutation = useUpdateCategory({
    onSuccess: () => {
      setEditing(null);
    },
  });

  const deleteMutation = useDeleteCategory();

  useAppLoading([
    listQuery.isFetching,
    createMutation.isPending,
    updateMutation.isPending,
    deleteMutation.isPending,
  ]);

  const categories = listQuery.data?.data ?? [];
  const total = listQuery.data?.total ?? 0;
  const totalPages = useMemo(() => {
    if (total === 0) return 1;
    return Math.ceil(total / DEFAULT_LIMIT);
  }, [total]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchTerm(searchInput.trim());
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setPage(1);
  };

  const onCreate = (data: CategoryFormValues) => {
    createMutation.mutate({
      name: data.name.trim(),
      description: data.description?.trim() || undefined,
    });
  };

  const onEdit = (data: CategoryFormValues) => {
    if (!editing) return;
    updateMutation.mutate({
      id: editing.id,
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
      },
    });
  };

  const handleStartEdit = (category: Category) => {
    setEditing(category);
    editForm.reset({
      name: category.name,
      description: category.description ?? "",
    });
  };

  const handleCancelEdit = () => {
    setEditing(null);
  };

  const handleDelete = (category: Category) => {
    if (!window.confirm(t("deleteConfirm", { name: category.name }))) return;
    deleteMutation.mutate(category.id);
  };

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {t("title")}
          </h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("searchTitle")}</CardTitle>
            <CardDescription>{t("searchDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col gap-3 md:flex-row md:items-center"
            >
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={t("searchPlaceholder")}
              />
              <div className="flex items-center gap-2">
                <Button type="submit">{t("search")}</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClearSearch}
                  disabled={!searchInput && !searchTerm}
                >
                  {t("clear")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {editing && (
          <Card>
            <CardHeader>
              <CardTitle>{t("editTitle")}</CardTitle>
              <CardDescription>{t("editDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...editForm}>
                <form
                  onSubmit={editForm.handleSubmit(onEdit)}
                  className="space-y-4"
                >
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("nameLabel")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("namePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("descriptionLabel")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("descriptionPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? t("saving") : t("save")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      {t("cancel")}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card>
            <CardHeader>
              <CardTitle>{t("listTitle")}</CardTitle>
              <CardDescription>
                {t("listDescription", { total })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {listQuery.isError ? (
                <p className="text-sm text-destructive">{t("error")}</p>
              ) : categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("empty")}</p>
              ) : (
                categories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-lg border border-border bg-background p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold text-foreground">
                          {category.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {category.description || t("noDescription")}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {t("wordCount", { count: category.wordCount ?? 0 })}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/categories/${category.id}`}>
                          {t("view")}
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/flashcards?categoryId=${category.id}`}>
                          {t("study")}
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStartEdit(category)}
                      >
                        {t("edit")}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(category)}
                      >
                        {t("delete")}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                {t("page")} {page} {t("of")} {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page <= 1}
                >
                  {t("prev")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={page >= totalPages}
                >
                  {t("next")}
                </Button>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("addTitle")}</CardTitle>
              <CardDescription>{t("addDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...createForm}>
                <form
                  onSubmit={createForm.handleSubmit(onCreate)}
                  className="space-y-4"
                >
                  <FormField
                    control={createForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("nameLabel")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("namePlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("descriptionLabel")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("descriptionPlaceholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? t("submitting") : t("submit")}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
