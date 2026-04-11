"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Middleware } from "swr";
import { SWRConfig } from "swr";

interface ReadyStateContextType {
  isPageReady: boolean;
  setPageReady: (ready: boolean) => void;
  registerQuery: () => void;
  unregisterQuery: () => void;
}

export const ReadyStateContext = createContext<ReadyStateContextType | undefined>(undefined);

const globalLoadingMiddleware: Middleware = (useSWRNext) => {
  return (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config);
    const { registerQuery, unregisterQuery } = useReadyState();

    useEffect(() => {
      if (swr.isLoading) {
        registerQuery();
        return () => unregisterQuery();
      }
    }, [swr.isLoading, registerQuery, unregisterQuery]);

    return swr;
  };
};

export function ReadyStateProvider({ children }: { children: ReactNode }) {
  const [isPageReady, setPageReady] = useState(false);
  const [activeQueries, setActiveQueries] = useState(0);

  const registerQuery = useCallback(() => {
    setActiveQueries(prev => prev + 1);
  }, []);

  const unregisterQuery = useCallback(() => {
    setActiveQueries(prev => Math.max(0, prev - 1));
  }, []);

  useEffect(() => {
    if (activeQueries === 0) {
      const timer = setTimeout(() => setPageReady(true), 150);
      return () => clearTimeout(timer);
    }
    else {
      setPageReady(false);
    }
  }, [activeQueries]);

  // Auto-set ready after max 10 seconds as safety fallback for hung queries
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageReady(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ReadyStateContext value={{ isPageReady, setPageReady, registerQuery, unregisterQuery }}>
      <SWRConfig value={{ use: [globalLoadingMiddleware] }}>
        {children}
      </SWRConfig>
    </ReadyStateContext>
  );
}

export function useReadyState() {
  const context = useContext(ReadyStateContext);
  if (!context) {
    throw new Error("useReadyState must be used within ReadyStateProvider");
  }
  return context;
}
