"use client";

import { Music4 } from "lucide-react";

import { BeatmapSetCard } from "@/components/Beatmaps/BeatmapSetCard";
import { Button } from "@/components/ui/button";
import { useUserFavourites } from "@/lib/hooks/api/user/useUserFavourites";
import type { UserBeatmapSetCollectionType } from "@/lib/hooks/api/user/useUserProfile";
import {
  useUserBeatmapSets,
} from "@/lib/hooks/api/user/useUserProfile";
import type { GameMode } from "@/lib/types/api";

interface ProfileBeatmapsSectionProps {
  userId: number;
  gameMode: GameMode;
}

const PAGE_LIMIT = 6;

export function ProfileBeatmapsSection({
  userId,
  gameMode,
}: ProfileBeatmapsSectionProps) {
  const favouritesQuery = useUserFavourites(userId, gameMode, PAGE_LIMIT);
  const rankedQuery = useUserBeatmapSets(userId, gameMode, "ranked", PAGE_LIMIT);
  const lovedQuery = useUserBeatmapSets(userId, gameMode, "loved", PAGE_LIMIT);
  const guestQuery = useUserBeatmapSets(userId, gameMode, "guest", PAGE_LIMIT);
  const pendingQuery = useUserBeatmapSets(userId, gameMode, "pending", PAGE_LIMIT);
  const graveyardQuery = useUserBeatmapSets(userId, gameMode, "graveyard", PAGE_LIMIT);
  const nominatedQuery = useUserBeatmapSets(userId, gameMode, "nominated", PAGE_LIMIT);

  const blocks = [
    {
      key: "favourite" as const,
      title: "Favourite Beatmaps",
      alwaysShow: true,
      items: favouritesQuery.data?.flatMap(page => page.sets) ?? [],
      total: favouritesQuery.data?.find(page => page.total_count !== undefined)?.total_count ?? 0,
      onShowMore: () => favouritesQuery.setSize(favouritesQuery.size + 1),
    },
    createCollectionBlock("ranked", "Ranked Beatmapsets", rankedQuery),
    createCollectionBlock("loved", "Loved Beatmapsets", lovedQuery),
    createCollectionBlock("guest", "Guest Difficulties", guestQuery),
    createCollectionBlock("pending", "Pending Beatmapsets", pendingQuery),
    createCollectionBlock("graveyard", "Graveyard Beatmapsets", graveyardQuery),
    createCollectionBlock("nominated", "Nominated Beatmapsets", nominatedQuery),
  ];

  return (
    <div className="space-y-6">
      {blocks
        .filter(block => block.alwaysShow || block.total > 0)
        .map(block => (
          <div key={block.key} className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Music4 className="size-4 text-primary" />
              <span>{block.title}</span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                {block.total}
              </span>
            </div>

            {block.items.length > 0
              ? (
                  <div className="grid gap-3 xl:grid-cols-2">
                    {block.items.map(beatmapSet => (
                      <BeatmapSetCard key={`${block.key}-${beatmapSet.id}`} beatmapSet={beatmapSet} />
                    ))}
                  </div>
                )
              : (
                  <div className="rounded-[14px] border border-dashed border-border/50 bg-secondary/25 px-4 py-6 text-sm text-muted-foreground">
                    {block.alwaysShow
                      ? "No favourite beatmaps yet."
                      : "Nothing in this category yet."}
                  </div>
                )}

            {block.items.length < block.total && (
              <div className="flex justify-center pt-1">
                <Button variant="secondary" onClick={block.onShowMore}>
                  Show More
                </Button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

function createCollectionBlock(
  key: UserBeatmapSetCollectionType,
  title: string,
  query: ReturnType<typeof useUserBeatmapSets>,
) {
  return {
    key,
    title,
    alwaysShow: false,
    items: query.data?.flatMap(page => page.sets) ?? [],
    total: query.data?.find(page => page.total_count !== undefined)?.total_count ?? 0,
    onShowMore: () => query.setSize(query.size + 1),
  };
}
