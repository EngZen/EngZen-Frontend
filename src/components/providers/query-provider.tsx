"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: Error;
  }
}

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Common.error");

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            const errorMessage =
              (query.meta?.errorMessage as string) ||
              error.message ||
              t("default");
            toast.error(errorMessage);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            const errorMessage =
              (mutation.meta?.errorMessage as string) ||
              error.message ||
              t("default");
            toast.error(errorMessage);
          },
        }),
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
