"use client";
import { motion } from "framer-motion";
import { Download, LucideHistory, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";

import BeatmapStatusIcon from "@/components/BeatmapStatus";
import DifficultyIcon from "@/components/DifficultyIcon";
import PrettyDate from "@/components/General/PrettyDate";
import ImageWithFallback from "@/components/ImageWithFallback";
import { ModIcons } from "@/components/ModIcons";
import ScoreStats from "@/components/ScoreStats";
import { ScoreDetailSkeleton } from "@/components/Skeletons/Scores/ScoreDetailSkeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import UserElement from "@/components/UserElement";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import { useDownloadReplay } from "@/lib/hooks/api/score/useDownloadReplay";
import { useScore } from "@/lib/hooks/api/score/useScore";
import { useUser } from "@/lib/hooks/api/user/useUser";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import { BeatmapStatusWeb } from "@/lib/types/api";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import { tryParseNumber } from "@/lib/utils/type.util";

export default function Score(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const paramsId = tryParseNumber(params.id) ?? 0;
  const t = useT("pages.score");

  const { self } = useSelf();

  const [useSpaciousUI] = useState(() => {
    if (typeof window === "undefined")
      return false;
    return localStorage.getItem("useSpaciousUI") === "true";
  });

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
        <div className="overflow-hidden rounded-[10px] border border-border/50 bg-card p-4 shadow-md">
          <ScoreDetailSkeleton />
        </div>
      </div>
    );
  }

  const errorMessage
    = scoreQuery.error?.message
      ?? userQuery?.error?.message
      ?? beatmapQuery?.error?.message
      ?? t("error.notFound");

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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        className="overflow-hidden rounded-[10px] border border-border/50 bg-card p-4 shadow-md"
      >
        {score && user && beatmap ? (
          <div className="space-y-3">
            <div className="md:h-68 relative z-20 overflow-hidden rounded-lg">
              <div className="flex h-full flex-col place-content-between rounded-lg bg-card/65 p-5 md:flex-row">
                <div className="flex size-full flex-col overflow-hidden">
                  <Link
                    href={`/beatmapsets/${beatmap?.beatmapset_id}/${beatmap?.id}`}
                    className="group/link"
                  >
                    <div className="text-shadow flex items-center text-xl font-bold">
                      <span className="pr-1">
                        <BeatmapStatusIcon
                          status={beatmap.status ?? BeatmapStatusWeb.GRAVEYARD}
                        />
                      </span>
                      <span className="line-clamp-3 text-white transition-colors group-hover/link:text-primary">
                        {beatmap.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-shadow line-clamp-2 text-base text-foreground/90 transition-colors group-hover/link:text-foreground">
                        {beatmap.artist}
                      </div>
                    </div>
                  </Link>
                  <div
                    className={`${getGradeColor(score.grade)} m-auto mt-6 text-7xl font-bold drop-shadow-lg md:m-0`}
                  >
                    {score.grade}
                  </div>
                  <span className="mt-auto text-xl font-bold">
                    <ModIcons modsBitset={score.mods_int ?? 0} />
                  </span>
                </div>

                <Separator className="my-4 md:hidden" />

                <div className="w-full flex-col place-content-between items-center space-y-4 md:flex md:w-1/2">
                  <div className="flex w-full flex-col">
                    <div className="text-shadow flex items-center justify-end gap-0.5 text-base text-yellow-400">
                      <DifficultyIcon
                        iconColor="#facc15"
                        gameMode={score.game_mode}
                        className="flex-shrink-0 text-base"
                      />
                      <p className="whitespace-nowrap">
                        ★
                        {" "}
                        {beatmap
                          && getBeatmapStarRating(beatmap).toFixed(2)}
                      </p>
                      <span className="ml-1 flex items-center overflow-hidden">
                        <span>[</span>
                        <span className="truncate">
                          {beatmap?.version
                            || t("beatmap.versionUnknown")}
                        </span>
                        <span>]</span>
                      </span>
                    </div>

                    <p className="text-shadow text-right text-muted-foreground">
                      {t("beatmap.mappedBy")}
                      {" "}
                      {beatmap?.creator || t("beatmap.creatorUnknown")}
                    </p>
                  </div>

                  <div className="w-full">
                    <p className="text-shadow text-right text-5xl font-bold tracking-tight text-white">
                      {score.total_score.toLocaleString()}
                    </p>
                    <div className="text-right">
                      <div className="flex flex-row items-center justify-end text-nowrap">
                        <p className="text-foreground/80">
                          {t("score.submittedOn")}&nbsp;
                        </p>
                        <PrettyDate
                          className="text-foreground/80"
                          time={score.when_played}
                        />
                      </div>

                      <p className="text-foreground/80">
                        {t("score.playedBy")}
                        {" "}
                        <Link
                          href={`/user/${user.user_id}`}
                          className="font-medium text-foreground transition-colors hover:text-primary"
                        >
                          {user.username}
                        </Link>
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full justify-end space-x-2">
                    <Button
                      onClick={downloadReplay}
                      disabled={!self || !score.has_replay}
                      isLoading={isReplayLoading}
                      variant="secondary"
                    >
                      <Download />
                      {t("actions.downloadReplay")}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" disabled={!self || true}>
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

              <div className="absolute inset-0 -z-10 overflow-hidden rounded-lg">
                <ImageWithFallback
                  src={`https://assets.ppy.sh/beatmaps/${beatmap?.beatmapset_id}/covers/cover@2x.jpg`}
                  alt="beatmap image"
                  fill={true}
                  objectFit="cover"
                  className="relative"
                  fallBackSrc="/images/unknown-beatmap-banner.jpg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-5">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut", delay: 0.2 }}
                className="xl:col-span-2"
              >
                <UserElement user={user} />
              </motion.div>

              {useSpaciousUI && <div className="hidden xl:grid" />}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut", delay: 0.3 }}
                className={useSpaciousUI ? "xl:col-span-2" : "xl:col-span-3"}
              >
                <ScoreStats score={score} beatmap={beatmap} variant="score" />
              </motion.div>
            </div>
          </div>
        ) : (
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
        )}
      </motion.div>
    </div>
  );
}
