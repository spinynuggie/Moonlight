"use client";

import Cookies from "js-cookie";
import type { ReactNode } from "react";
import { createContext, useCallback, useEffect, useState } from "react";

import { useUserSelf } from "@/lib/hooks/api/user/useUser";
import type { UserResponse } from "@/lib/types/api";

interface SelfContextType {
  self: UserResponse | undefined;
  isLoading: boolean;
  hasAuthCookie: boolean;
  revalidate: () => void;
}

export const SelfContext = createContext<SelfContextType | undefined>(
  undefined,
);

interface SelfProviderProps {
  children: ReactNode;
  initialHasAuthCookie: boolean;
}

let cachedSelf: UserResponse | undefined;

function readHasAuthCookie() {
  return !!(
    Cookies.get("session_token")
    || Cookies.get("refresh_token")
  );
}

export const SelfProvider: React.FC<SelfProviderProps> = ({
  children,
  initialHasAuthCookie,
}) => {
  const [hasAuthCookie, setHasAuthCookie] = useState(initialHasAuthCookie);
  const selfUserQuery = useUserSelf(
    hasAuthCookie,
    cachedSelf ? { fallbackData: cachedSelf } : undefined,
  );

  const { data, isLoading: isSelfLoading } = selfUserQuery;

  useEffect(() => {
    setHasAuthCookie(readHasAuthCookie());
  }, []);

  useEffect(() => {
    if (data) {
      cachedSelf = data;
    }
  }, [data]);

  const revalidate = useCallback(() => {
    const nextHasAuthCookie = readHasAuthCookie();

    if (!nextHasAuthCookie) {
      cachedSelf = undefined;
      void selfUserQuery.mutate(undefined, { revalidate: false });
      setHasAuthCookie(false);
      return;
    }

    setHasAuthCookie(true);

    if (hasAuthCookie) {
      void selfUserQuery.mutate();
    }
  }, [hasAuthCookie, selfUserQuery]);

  const isLoading = hasAuthCookie ? isSelfLoading && data === undefined : false;

  return (
    <SelfContext
      value={{
        self: data ?? cachedSelf,
        isLoading,
        hasAuthCookie,
        revalidate,
      }}
    >
      {children}
    </SelfContext>
  );
};
