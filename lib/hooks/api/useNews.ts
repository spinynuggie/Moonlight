"use client";

import useSWR from "swr";

import type { NewsPostMeta } from "@/lib/news.constants";

function newsFetcher(url: string) {
  return fetch(url).then(res => res.json() as Promise<NewsPostMeta[]>);
}

export function useNews() {
  return useSWR<NewsPostMeta[]>("/api/news", newsFetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  });
}
