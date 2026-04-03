"use client";

import localFont from "next/font/local";

import type { BeatmapResponse } from "@/lib/types/api";
import { GameMode } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import { getStarRatingColor } from "@/lib/utils/getStarRatingColor";

export const osuIconFont = localFont({
  src: "../public/fonts/osu.woff2",
});

const modeBadgeMap = {
  [GameMode.STANDARD]: "\ue800",
  [GameMode.TAIKO]: "\ue803",
  [GameMode.CATCH_THE_BEAT]: "\ue801",
  [GameMode.MANIA]: "\ue802",
};

export function gameModeGlyph(mode: GameMode): string {
  return modeBadgeMap[mode as keyof typeof modeBadgeMap] ?? "\ue800";
}

export function GameModeIcon({ mode, className }: { mode: GameMode; className?: string }) {
  return (
    <span className={cn("text-[11px] leading-none", osuIconFont.className, className)}>
      {gameModeGlyph(mode)}
    </span>
  );
}

function modeBadge(mode: GameMode) {
  // @ts-expect-error -- Indexing with enum
  return mode in modeBadgeMap ? modeBadgeMap[mode] : "\ue800";
}

interface DifficultyIconProps {
  difficulty?: BeatmapResponse;
  iconColor?: string;
  gameMode?: GameMode;
  className?: string;
}

export default function DifficultyIcon({
  difficulty,
  iconColor,
  gameMode,
  className,
}: DifficultyIconProps) {
  const modeBadgeText = gameMode
    ? modeBadge(gameMode)
    : difficulty
      ? modeBadge(difficulty.mode)
      : modeBadge(GameMode.STANDARD);

  const badgeColor
    = difficulty && gameMode
      ? getStarRatingColor(getBeatmapStarRating(difficulty, gameMode))
      : difficulty
        ? getStarRatingColor(getBeatmapStarRating(difficulty, difficulty.mode))
        : iconColor ?? null;

  return (
    <p
      style={
        badgeColor
          ? {
              color: `${badgeColor}`,
            }
          : {}
      }
      className={cn(
        "-m-1 px-1 text-2xl text-current",
        osuIconFont.className,
        className,
      )}
    >
      {modeBadgeText}
    </p>
  );
}
