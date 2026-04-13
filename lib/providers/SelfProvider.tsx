"use client";

import Cookies from "js-cookie";
import type { ReactNode } from "react";
import { createContext, useCallback, useEffect, useState } from "react";

import PagePreloader from "@/components/PagePreloader";
import { useBeatmapsetSearch } from "@/lib/hooks/api/beatmap/useBeatmapsetSearch";
import { useTopScores } from "@/lib/hooks/api/score/useTopScores";
import { useUserSelf, useUserStats } from "@/lib/hooks/api/user/useUser";
import { useUserMetadata } from "@/lib/hooks/api/user/useUserMetadata";
import { useUsersLeaderboard } from "@/lib/hooks/api/user/useUsersLeaderboard";
import { useReadyState } from "@/lib/providers/ReadyStateProvider";
import type { CountryCode, UserResponse } from "@/lib/types/api";
import { BeatmapStatusWeb, GameMode, LeaderboardSortType } from "@/lib/types/api";

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
  const [isHydrated, setIsHydrated] = useState(false);
  const { isPageReady } = useReadyState();
  const selfUserQuery = useUserSelf(
    hasAuthCookie,
    cachedSelf ? { fallbackData: cachedSelf } : undefined,
  );

  const { data, isLoading: isSelfLoading } = selfUserQuery;

  useTopScores(GameMode.STANDARD, 20, {
    refreshInterval: 0,
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  useBeatmapsetSearch(
    "",
    5,
    [
      BeatmapStatusWeb.RANKED,
      BeatmapStatusWeb.LOVED,
      BeatmapStatusWeb.APPROVED,
    ],
    GameMode.STANDARD,
    undefined,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );

  useUsersLeaderboard(
    GameMode.STANDARD,
    LeaderboardSortType.PP,
    1,
    50,
    null as unknown as CountryCode,
  );

  useUserStats(data?.user_id ?? null, GameMode.STANDARD);
  useUserMetadata(data?.user_id ?? null);

  useEffect(() => {
    setHasAuthCookie(readHasAuthCookie());
    setIsHydrated(true);
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

  // Page is ready when hydrated, not loading user data, AND the page signals it's ready
  const isReady = isHydrated && !isLoading && isPageReady;
  const [wasReady, setWasReady] = useState(false);
  useEffect(() => {
    if (isReady)
      setWasReady(true);
  }, [isReady]);

  return (
    <>
      <PagePreloader isReady={wasReady} />
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
    </>
  );
};
