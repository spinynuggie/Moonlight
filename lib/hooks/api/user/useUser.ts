"use client";

import type { SWRConfiguration } from "swr";
import useSWR from "swr";

import type { GameMode, UserResponse, UserWithStats } from "@/lib/types/api";

export function useUserSelf(
  shouldFetch = true,
  options?: SWRConfiguration<UserResponse>,
) {
  return useSWR<UserResponse>(shouldFetch ? "user/self" : null, options);
}

export function useUser(id: number | null) {
  return useSWR<UserResponse>(id ? `user/${id}` : null);
}

export function useUserStats(id: number | null, mode: GameMode | null) {
  return useSWR<UserWithStats>(id && mode ? `user/${id}/${mode}` : null);
}
