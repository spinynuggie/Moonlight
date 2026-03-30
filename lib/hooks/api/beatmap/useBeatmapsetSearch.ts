"use client";

import type { SWRConfiguration } from "swr";
import useSWRInfinite from "swr/infinite";

import type {
  BeatmapStatusWeb,
  GameMode,
  GetBeatmapsetSearchResponse,
} from "@/lib/types/api";

export function useBeatmapsetSearch(
  query: string,
  limit?: number,
  status?: BeatmapStatusWeb[],
  mode?: GameMode,
  options?: SWRConfiguration,
  artist?: string,
  title?: string,
) {
  const getKey = (
    pageIndex: number,
    previousPageData?: GetBeatmapsetSearchResponse,
  ) => {
    if (previousPageData && previousPageData.sets.length === 0)
      return null;
    if (limit === 0)
      return null;

    const queryParams = new URLSearchParams({
      page: (pageIndex + 1).toString(),
    });

    if (query)
      queryParams.append("query", query.toString());
    if (artist)
      queryParams.append("artist", artist);
    if (title)
      queryParams.append("title", title);
    if (limit)
      queryParams.append("limit", limit.toString());
    if (mode)
      queryParams.append("mode", mode.toString());

    if (status && status.length > 0) {
      status.forEach(s => queryParams.append("status", s));
    }

    return `beatmapset/search?${queryParams.toString()}`;
  };

  return useSWRInfinite<GetBeatmapsetSearchResponse>(getKey, options);
}
