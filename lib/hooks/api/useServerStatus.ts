"use client";

import useSWR from "swr";

import type { GetStatusResponse } from "@/lib/types/api";

let cachedStatus: GetStatusResponse | undefined;

export function useServerStatus() {
  const result = useSWR<GetStatusResponse>(
    "status?detailed=true&includeRecentUsers=true",
    { ...(cachedStatus ? { fallbackData: cachedStatus } : {}) },
  );

  if (result.data) {
    cachedStatus = result.data;
  }

  return result;
}
