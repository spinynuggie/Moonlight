"use client";

import useSWR from "swr";

import type { NewsPostMeta } from "@/lib/news.constants";

let cachedNews: NewsPostMeta[] | undefined;

function newsFetcher(url: string) {
  return fetch(url).then(res => res.json() as Promise<NewsPostMeta[]>);
}

export function useNews() {
  const result = useSWR<NewsPostMeta[]>("/api/news", newsFetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
    ...(cachedNews ? { fallbackData: cachedNews } : {}),
  });

  if (result.data) {
    cachedNews = result.data;
  }

  return result;
}
