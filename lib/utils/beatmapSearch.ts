export type BeatmapSearchKey = "title" | "artist";

export function makeBeatmapSearchUrl(key: BeatmapSearchKey, value: string): string {
  return `/beatmaps/search?${key}=${encodeURIComponent(value)}`;
}
