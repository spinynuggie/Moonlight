"use client";

import { LucideMedal } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

import { Tooltip } from "@/components/Tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserMedals } from "@/lib/hooks/api/user/useUserMedals";
import type { GameMode, GetUserByIdMedalsResponse, UserMedalResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { timeSince } from "@/lib/utils/timeSince";

interface ProfileMedalsSectionProps {
  userId: number;
  gameMode: GameMode;
}

const CATEGORY_TITLES: Record<keyof GetUserByIdMedalsResponse, string> = {
  hush_hush: "Hush-Hush",
  beatmap_hunt: "Beatmap Challenge Packs",
  mod_introduction: "Beatmap Packs",
  skill: "Skill",
};

export function ProfileMedalsSection({
  userId,
  gameMode,
}: ProfileMedalsSectionProps) {
  const medalsQuery = useUserMedals(userId, gameMode);

  const latestMedals = useMemo(() => {
    const medals = medalsQuery.data;

    if (!medals)
      return [];

    return Object.values(medals)
      .flatMap(group => group.medals)
      .filter(medal => medal.unlocked_at)
      .sort((left, right) => {
        return new Date(right.unlocked_at!).getTime() - new Date(left.unlocked_at!).getTime();
      })
      .slice(0, 8);
  }, [medalsQuery.data]);

  if (!medalsQuery.data && medalsQuery.isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="aspect-square rounded-full" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-40 rounded-[14px]" />
          ))}
        </div>
      </div>
    );
  }

  if (!medalsQuery.data) {
    return (
      <div className="rounded-[14px] border border-dashed border-border/50 bg-secondary/25 px-4 py-6 text-sm text-muted-foreground">
        Medals are unavailable right now.
      </div>
    );
  }

  return (
    <div className="profile-crossfade-in space-y-6">
      {latestMedals.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <LucideMedal className="size-4 text-primary" />
            <span>Latest</span>
          </div>
          <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
            {latestMedals.map(medal => (
              <MedalBadge key={`latest-${medal.id}`} medal={medal} />
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {Object.entries(CATEGORY_TITLES).map(([category, title]) => {
          const medals = medalsQuery.data?.[category as keyof GetUserByIdMedalsResponse].medals ?? [];

          return (
            <div
              key={category}
              className="rounded-[14px] border border-border/40 bg-secondary/30 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <span className="mt-1 inline-block h-[2px] w-8 rounded-full bg-primary" />
                </div>
                <span className="rounded-full bg-card/70 px-2 py-0.5 text-xs text-muted-foreground">
                  {medals.filter(medal => medal.unlocked_at).length}/{medals.length}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3 md:grid-cols-5">
                {medals.map(medal => (
                  <MedalBadge key={medal.id} medal={medal} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MedalBadge({ medal }: { medal: UserMedalResponse }) {
  const achieved = Boolean(medal.unlocked_at);

  return (
    <Tooltip
      content={(
        <div className="max-w-60 text-center">
          <p className="text-sm font-semibold text-primary">{medal.name}</p>
          <p className="mt-1 text-xs text-muted-foreground">{medal.description}</p>
          <p className="mt-2 text-[11px] text-muted-foreground">
            {achieved && medal.unlocked_at
              ? `Unlocked ${timeSince(medal.unlocked_at)}`
              : "Not unlocked yet"}
          </p>
        </div>
      )}
    >
      <div className="flex items-center justify-center rounded-[18px] border border-border/40 bg-card/70 p-2">
        <Image
          src={`https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/medals/client/${medal.id}@2x.png`}
          alt={medal.name}
          width={76}
          height={76}
          className={cn(
            "size-full rounded-full transition-opacity",
            achieved ? "opacity-100" : "opacity-35 grayscale",
          )}
        />
      </div>
    </Tooltip>
  );
}
