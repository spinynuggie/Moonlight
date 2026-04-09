"use client";

import useSWR from "swr";

import fetcher from "@/lib/services/fetcher";
import type {
  CountryCode,
  GameMode,
  GetUserLeaderboardResponse,
  LeaderboardSortType,
} from "@/lib/types/api";

export function useUsersLeaderboard(
  mode: GameMode,
  type: LeaderboardSortType,
  page?: number,
  limit?: number,
  country?: CountryCode | null,
) {
  return useSWR<GetUserLeaderboardResponse>(
    `user/leaderboard?mode=${mode}&type=${type}${page ? `&page=${page}` : ""}${
      limit ? `&limit=${limit}` : ""
    }${country ? `&country=${country}` : ""}`,
    fetcher,
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );
}
