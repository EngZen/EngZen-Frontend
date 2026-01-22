"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { GlobalLoading } from "@/components/ui/global-loading";

interface LoadingContextType {
  isLoading: boolean;
  show: (key?: string | string[]) => void;
  hide: (key?: string | string[]) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

const DEFAULT_KEY = "global";

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set());

  const show = useCallback((key: string | string[] = DEFAULT_KEY) => {
    setLoadingKeys((prev) => {
      const newSet = new Set(prev);
      const keys = Array.isArray(key) ? key : [key];
      keys.forEach((k) => {
        newSet.add(k);
      });
      return newSet;
    });
  }, []);

  const hide = useCallback((key: string | string[] = DEFAULT_KEY) => {
    setLoadingKeys((prev) => {
      const newSet = new Set(prev);
      const keys = Array.isArray(key) ? key : [key];
      keys.forEach((k) => {
        newSet.delete(k);
      });
      return newSet;
    });
  }, []);

  const isLoading = loadingKeys.size > 0;

  const value = useMemo(
    () => ({ isLoading, show, hide }),
    [isLoading, show, hide],
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <GlobalLoading isLoading={isLoading} />
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}

export function useAppLoading(loadingStates: boolean[]) {
  const { show, hide } = useLoading();
  const id = useId();

  useEffect(() => {
    const isLoading = loadingStates.some(Boolean);
    if (isLoading) {
      show(id);
    } else {
      hide(id);
    }

    return () => {
      hide(id);
    };
  }, [loadingStates, show, hide, id]);
}
