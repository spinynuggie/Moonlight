"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import AudioPreview from "@/app/(website)/user/[id]/components/AudioPreview";
import BeatmapDifficultyBadge from "@/components/BeatmapDifficultyBadge";
import BeatmapStatusIcon from "@/components/BeatmapStatus";
import { CollapsibleBadgeList } from "@/components/CollapsibleBadgeList";
import PrettyDate from "@/components/General/PrettyDate";
import ImageWithFallback from "@/components/ImageWithFallback";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Skeleton } from "@/components/ui/skeleton";
import useAudioPlayer from "@/lib/hooks/useAudioPlayer";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapSetResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";

interface BeatmapSetOverviewProps {
  beatmapSet: BeatmapSetResponse;
}

export default function BeatmapSetOverview({
  beatmapSet,
}: BeatmapSetOverviewProps) {
  const t = useT("pages.user.components.beatmapSetOverview");
  const [isHovered, setIsHovered] = useState(false);

  const { playerRef, isPlaying, currentTimestamp } = useAudioPlayer();

  const isPlayingThis = playerRef.current?.src.includes(`${beatmapSet.id}.mp3`);

  return (
    <div
      className="relative flex h-24 overflow-hidden  rounded-lg bg-background transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {beatmapSet.id ? (
        <ImageWithFallback
          src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/cover.jpg`}
          alt=""
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
          fallBackSrc="/images/unknown-beatmap-banner.jpg"
        />
      ) : (
        <Skeleton className="" />
      )}

      <div className="relative z-20 size-24 flex-shrink-0">
        {beatmapSet.id ? (
          <ImageWithFallback
            src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list.jpg`}
            alt={`${beatmapSet.title} cover`}
            className=""
            layout="fill"
            objectFit="cover"
            fallBackSrc="/images/unknown-beatmap-banner.jpg"
          />
        ) : (
          <Skeleton className="" />
        )}

        <div
          className={cn(
            "smooth-transition absolute  inset-0 z-30 flex items-center justify-center",
            isHovered || (isPlaying && isPlayingThis)
              ? "opacity-100"
              : "opacity-0",
          )}
        >
          <AudioPreview beatmapSet={beatmapSet} />
        </div>

        <div
          className={cn(
            "smooth-transition absolute inset-0 z-20 flex items-center justify-center bg-terracotta-800 bg-opacity-50",
            isHovered || (isPlaying && isPlayingThis)
              ? "opacity-100"
              : "opacity-0",
          )}
        >
          <CircularProgress
            value={currentTimestamp * 10}
            strokeWidth={4}
            className="hidden"
            progressClassName={cn(
              "relative",
              !isPlayingThis ? "hidden" : undefined,
            )}
          />
        </div>
      </div>

      <div className="z-10 flex h-24 w-full flex-col justify-between overflow-hidden bg-gradient-to-r from-black/70 to-transparent">
        <div
          className={cn(
            "smooth-transition z-20 size-full bg-card px-3 py-1",
            isHovered ? " bg-opacity-70" : " bg-opacity-50",
          )}
        >
          <Link href={`/beatmapsets/${beatmapSet.id}`}>
            <div>
              <div className="flex items-center">
                <span className="-ml-1 mr-1">
                  <BeatmapStatusIcon status={beatmapSet.status} />
                </span>
                <h3 className="truncate text-base font-semibold text-white">
                  {beatmapSet.title}
                </h3>
              </div>
              <p className="truncate text-xs text-foreground/80">
                {t("by", { artist: beatmapSet.artist })}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {t("mappedBy", { creator: beatmapSet.creator })}
              </p>
            </div>
          </Link>
          <div className="flex flex-col">
            <div
              className={cn(
                "smooth-transition flex items-center text-muted-foreground",
                isHovered ? "opacity-100" : "opacity-0",
              )}
            >
              <Calendar className="mr-1 h-[11px] w-[11px]" />
              <PrettyDate
                time={beatmapSet.submitted_date}
                className="text-[10px] font-bold"
              />
            </div>

            <div className="-ml-0.5 flex h-5 w-fit flex-row flex-wrap space-x-0.5  overflow-hidden rounded-lg">
              <CollapsibleBadgeList
                maxVisible={11}
                disableButton
                className="gap-0.5"
                badges={beatmapSet.beatmaps
                  .sort(
                    (a, b) => getBeatmapStarRating(a) - getBeatmapStarRating(b),
                  )
                  .sort((a, b) => a.mode_int - b.mode_int)
                  .map(beatmap => (
                    <BeatmapDifficultyBadge
                      key={`beatmap-difficulty-badge-${beatmap.id}`}
                      beatmap={beatmap}
                      iconPreview
                    />
                  ))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
