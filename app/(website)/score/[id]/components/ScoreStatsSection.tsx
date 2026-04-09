"use client";

import Image from "next/image";
import Link from "next/link";

import PrettyDate from "@/components/General/PrettyDate";
import { Tooltip } from "@/components/Tooltip";
import UserHoverCard from "@/components/UserHoverCard";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapResponse, ScoreResponse, UserResponse } from "@/lib/types/api";
import { GameMode } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { gameModeToVanilla } from "@/lib/utils/gameMode.util";

interface ScoreStatsSectionProps {
  score: ScoreResponse;
  beatmap: BeatmapResponse;
  user: UserResponse;
}

export function ScoreStatsSection({
  score,
  beatmap,
  user,
}: ScoreStatsSectionProps) {
  const t = useT("pages.score");

  return (
    <div className="overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md">
      <div className="flex flex-col gap-5 p-4 md:flex-row md:gap-8 md:p-5">
        {/* User info */}
        <div className="flex-shrink-0 md:w-[280px]">
          <UserHoverCard user={user} asChild>
            <Link
              href={`/user/${user.user_id}`}
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <Image
                src={user.avatar_url}
                alt={user.username}
                width={40}
                height={40}
                className="rounded-full border border-border/50"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {user.username}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>{t("score.submittedOn")}</span>
                  <PrettyDate time={score.when_played} />
                </div>
              </div>
            </Link>
          </UserHoverCard>
        </div>

        {/* Stats grid */}
        <div className="flex-1 space-y-1.5">
          {/* Row 1: Accuracy, Combo, PP */}
          <div className="grid grid-cols-3 gap-[2px]">
            <StatCell
              label="Accuracy"
              highlight={score.accuracy === 100}
            >
              {score.accuracy.toFixed(2)}%
            </StatCell>
            <StatCell
              label="Combo"
              highlight={score.is_perfect
                || score.max_combo === beatmap.max_combo}
            >
              {score.max_combo}x
            </StatCell>
            <StatCell label="PP">
              {score.performance_points.toFixed(2)}
              {!beatmap.is_ranked && (
                <Tooltip content="If ranked">
                  <span className="ml-1 text-yellow-500">*</span>
                </Tooltip>
              )}
            </StatCell>
          </div>

          {/* Row 2: Gamemode-specific hit counts */}
          <GamemodeHitStats score={score} />
        </div>
      </div>
    </div>
  );
}

function GamemodeHitStats({ score }: { score: ScoreResponse }) {
  const vanilla = gameModeToVanilla(score.game_mode);

  if (vanilla === GameMode.TAIKO) {
    return (
      <div className="grid grid-cols-3 gap-[2px]">
        <StatCell label="Great">{score.count_300}</StatCell>
        <StatCell label="Ok">{score.count_100}</StatCell>
        <StatCell label="Miss">{score.count_miss}</StatCell>
      </div>
    );
  }

  if (vanilla === GameMode.CATCH_THE_BEAT) {
    return (
      <div className="grid grid-cols-4 gap-[2px]">
        <StatCell label="Great">{score.count_300}</StatCell>
        <StatCell label="Miss">{score.count_miss}</StatCell>
        <StatCell label="Large Droplet">{score.count_100}</StatCell>
        <StatCell label="Small Droplet">{score.count_50}</StatCell>
      </div>
    );
  }

  if (vanilla === GameMode.MANIA) {
    return (
      <div className="grid grid-cols-6 gap-[2px]">
        <StatCell label="Perfect">{score.count_geki}</StatCell>
        <StatCell label="Great">{score.count_300}</StatCell>
        <StatCell label="Good">{score.count_katu}</StatCell>
        <StatCell label="Ok">{score.count_100}</StatCell>
        <StatCell label="Meh">{score.count_50}</StatCell>
        <StatCell label="Miss">{score.count_miss}</StatCell>
      </div>
    );
  }

  // Default: osu! standard
  return (
    <div className="grid grid-cols-4 gap-[2px]">
      <StatCell label="Great">{score.count_300}</StatCell>
      <StatCell label="Ok">{score.count_100}</StatCell>
      <StatCell label="Meh">{score.count_50}</StatCell>
      <StatCell label="Miss">{score.count_miss}</StatCell>
    </div>
  );
}

function StatCell({
  label,
  children,
  highlight,
}: {
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 py-2">
      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        className={cn(
          "text-lg font-semibold",
          highlight && "text-primary",
        )}
      >
        {children}
      </span>
    </div>
  );
}
