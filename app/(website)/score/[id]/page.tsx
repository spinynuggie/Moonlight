"use client";
import { motion } from "framer-motion";
import { Download, LucideHistory, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";

import DifficultyIcon from "@/components/DifficultyIcon";
import PrettyDate from "@/components/General/PrettyDate";
import { ModIcons } from "@/components/ModIcons";
import ScoreStats from "@/components/ScoreStats";
import { ScoreDetailSkeleton } from "@/components/Skeletons/Scores/ScoreDetailSkeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import { useDownloadReplay } from "@/lib/hooks/api/score/useDownloadReplay";
import { useScore } from "@/lib/hooks/api/score/useScore";
import { useUser } from "@/lib/hooks/api/user/useUser";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import { cn } from "@/lib/utils";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import { getStatusPillStyle } from "@/lib/utils/getStatusPillStyle";
import { tryParseNumber } from "@/lib/utils/type.util";

export default function Score(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const paramsId = tryParseNumber(params.id) ?? 0;
  const t = useT("pages.score");

  const { self } = useSelf();

  const [coverLoaded, setCoverLoaded] = useState(false);

  const { isLoading: isReplayLoading, downloadReplay }
    = useDownloadReplay(paramsId);

  const scoreQuery = useScore(paramsId);

  const score = scoreQuery.data;

  const userQuery = useUser(score?.user_id ?? null);
  const beatmapQuery = useBeatmap(score?.beatmap_id ?? null);

  const user = userQuery?.data;
  const beatmap = beatmapQuery?.data;

  const isLoadingAny
    = scoreQuery?.isLoading
      || userQuery?.isLoading
      || beatmapQuery?.isLoading;

  const hasAllData = !!(score && user && beatmap);

  if (isLoadingAny || !hasAllData) {
    return (
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-2 rounded-[10px] border border-border/50 bg-card p-4 shadow-md">
          <span className="text-muted-foreground">
            <LucideHistory className="size-5" />
          </span>
          <h1 className="text-lg font-semibold">{t("header")}</h1>
        </div>
        <ScoreDetailSkeleton />
      </div>
    );
  }

  const errorMessage
    = scoreQuery.error?.message
      ?? userQuery?.error?.message
      ?? beatmapQuery?.error?.message
      ?? t("error.notFound");

  const pillStyle = getStatusPillStyle(beatmap.status);
  const starRating = getBeatmapStarRating(beatmap);

  return (
    <div className="flex flex-col space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-2 rounded-[10px] border border-border/50 bg-card p-4 shadow-md"
      >
        <span className="text-muted-foreground">
          <LucideHistory className="size-5" />
        </span>
        <h1 className="text-lg font-semibold">{t("header")}</h1>
      </motion.div>

      {score && user && beatmap ? (
        <>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
            className="group relative overflow-hidden rounded-[10px] border border-border/50 shadow-md"
          >
            {/* Full-card cover image background */}
            <div className="absolute inset-px z-0 overflow-hidden rounded-[inherit]">
              <div className="size-full" style={{ backgroundColor: "hsl(var(--secondary))" }}>
                <img
                  src={`https://assets.ppy.sh/beatmaps/${beatmap.beatmapset_id}/covers/cover@2x.jpg`}
                  alt=""
                  onLoad={() => setCoverLoaded(true)}
                  className={cn(
                    "size-full object-cover transition-opacity duration-500",
                    coverLoaded ? "opacity-100" : "opacity-0",
                  )}
                />
              </div>
            </div>

            {/* Content layer */}
            <div className="relative z-10">
              {/* Info area */}
              <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Base gradient bg */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: "hsl(var(--card) / 0.85)",
                  }}
                />

                {/* Info content */}
                <div className="relative flex min-w-0 flex-col p-4 md:p-5">
                  {/* Top section: beatmap info + score stats */}
                  <div className="flex flex-col gap-5 md:flex-row md:gap-6">
                    {/* Left: beatmap info */}
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/beatmapsets/${beatmap.beatmapset_id}/${beatmap.id}`}
                        className="group/link"
                      >
                        <h2
                          className="line-clamp-2 text-xl font-bold leading-tight text-white transition-colors group-hover/link:text-primary"
                          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.75)" }}
                        >
                          {beatmap.title}
                        </h2>
                        <p
                          className="mt-0.5 line-clamp-1 text-base font-semibold leading-tight text-foreground/80 transition-colors group-hover/link:text-foreground"
                          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.75)" }}
                        >
                          {beatmap.artist}
                        </p>
                      </Link>

                      {beatmap.status && (
                        <span
                          className="mt-1.5 inline-block rounded-full px-[6px] text-[10px] font-extrabold uppercase leading-[16px]"
                          style={{
                            backgroundColor: pillStyle.bg,
                            color: pillStyle.color,
                          }}
                        >
                          {beatmap.status}
                        </span>
                      )}

                      <div className="mt-2 flex items-center gap-1 text-sm text-yellow-400">
                        <DifficultyIcon
                          iconColor="#facc15"
                          gameMode={score.game_mode}
                          className="flex-shrink-0 text-sm"
                        />
                        <span className="whitespace-nowrap">
                          ★
                          {" "}
                          {starRating.toFixed(2)}
                        </span>
                        <span className="flex items-center overflow-hidden">
                          <span>[</span>
                          <span className="truncate">
                            {beatmap.version || t("beatmap.versionUnknown")}
                          </span>
                          <span>]</span>
                        </span>
                      </div>

                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {t("beatmap.mappedBy")}
                        {" "}
                        <span className="text-foreground/70">
                          {beatmap.creator || t("beatmap.creatorUnknown")}
                        </span>
                      </p>
                    </div>

                    {/* Right: score overview */}
                    <div className="flex items-start gap-4 md:flex-col md:items-end">
                      <div
                        className={cn(
                          "text-6xl font-extrabold drop-shadow-lg md:text-7xl",
                          getGradeColor(score.grade),
                        )}
                      >
                        {score.grade}
                      </div>
                      <div className="flex flex-col md:items-end">
                        <p className="text-3xl font-bold tracking-tight text-primary">
                          {score.performance_points.toFixed(0)}
                          <span className="text-sm font-medium text-primary/70">pp</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {score.accuracy.toFixed(2)}
                          %
                          {" · "}
                          {score.total_score.toLocaleString()}
                        </p>
                        <div className="mt-1">
                          <ModIcons modsBitset={score.mods_int ?? 0} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: user info + actions */}
                  <div className="mt-5 flex flex-col gap-3 border-t border-border/30 pt-4 sm:flex-row sm:items-center">
                    <Link
                      href={`/user/${user.user_id}`}
                      className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                    >
                      <Image
                        src={user.avatar_url}
                        alt={user.username}
                        width={32}
                        height={32}
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

                    <div className="flex items-center gap-2 sm:ml-auto">
                      <Button
                        onClick={downloadReplay}
                        disabled={!self || !score.has_replay}
                        isLoading={isReplayLoading}
                        variant="secondary"
                        size="sm"
                      >
                        <Download className="size-4" />
                        {t("actions.downloadReplay")}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" disabled={!self || true}>
                            <span className="sr-only">
                              {t("actions.openMenu")}
                            </span>
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/*
                    TODO: Implement
                    <DropdownMenuItem onClick={() => console.log("todo")}>
                      Report score
                    </DropdownMenuItem>

                    TODO: Implement
                    <DropdownMenuItem onClick={() => console.log("todo")}>
                      Pin score
                    </DropdownMenuItem> */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Score stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.25 }}
          >
            <ScoreStats score={score} beatmap={beatmap} variant="score" />
          </motion.div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="overflow-hidden rounded-[10px] border border-border/50 bg-card p-8 shadow-md"
        >
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
            <div className="flex flex-col space-y-2">
              <h1 className="text-4xl">{errorMessage}</h1>
              <p>{t("error.description")}</p>
            </div>
            <Image
              src="/images/user-not-found.png"
              alt="404"
              width={200}
              height={400}
              className="max-w-fit"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
