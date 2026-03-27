import Link from "next/link";

import AudioPreview from "@/app/(website)/user/[id]/components/AudioPreview";
import BeatmapStatusIcon from "@/components/BeatmapStatus";
import DifficultyIcon from "@/components/DifficultyIcon";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapSetResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";

import ImageWithFallback from "./ImageWithFallback";

interface BeatmapsetRowElementProps {
  beatmapSet: BeatmapSetResponse;
  className?: string;
  hideStatus?: boolean;
  hideDifficulties?: boolean;
}

export default function BeatmapsetRowElement({
  beatmapSet,
  className,
  hideStatus,
  hideDifficulties,
}: BeatmapsetRowElementProps) {
  const t = useT("components.beatmapsetRowElement");
  return (
    <div
      className={cn(
        "group relative h-16 w-full overflow-hidden rounded-lg",
        className,
      )}
    >
      <Link href={`/beatmapsets/${beatmapSet.id}`}>
        <div className="smooth-transition relative flex h-full flex-col place-content-between group-hover:cursor-pointer">
          <div
            className="smooth-transition absolute right-2 top-1/2 z-10 -translate-y-1/2 opacity-0 group-hover:opacity-100"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <AudioPreview beatmapSet={beatmapSet} className="size-8 min-h-8 min-w-8 p-0" />
          </div>
          <ImageWithFallback
            src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/cover@2x.jpg`}
            alt=""
            fill={true}
            objectFit="cover"
            className="rounded-t-lg bg-muted"
            fallBackSrc="/images/unknown-beatmap-banner.jpg"
          />

          <div className="smooth-transition absolute inset-0 bg-card/70 group-hover:bg-card/50" />

          <div className="relative flex items-center">
            <div className="relative mr-4 size-16 overflow-hidden rounded-lg">
              <ImageWithFallback
                src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list@2x.jpg`}
                alt=""
                fill={true}
                objectFit="cover"
                fallBackSrc="/images/unknown-beatmap-banner.jpg"
              />
            </div>

            <div className="flex w-9/12 flex-col">
              <div>
                <div className="flex items-center">
                  {!hideStatus && (
                    <span className="-ml-1 mr-1">
                      <BeatmapStatusIcon status={beatmapSet.status} />
                    </span>
                  )}
                  <div className="line-clamp-1 flex">
                    <h3 className="truncate text-base font-semibold text-white">
                      {beatmapSet.artist} - {beatmapSet.title}
                    </h3>
                  </div>
                </div>
                <p className="truncate text-[10px] text-muted-foreground">
                  {t("mappedBy", { creator: beatmapSet.creator })}
                </p>
              </div>

              {!hideDifficulties && (
                <div className="-ml-0.5  flex h-5 w-fit flex-row flex-wrap space-x-0.5 overflow-hidden rounded-lg bg-terracotta-800 bg-opacity-50">
                  {beatmapSet.beatmaps
                    .sort(
                      (a, b) => getBeatmapStarRating(a) - getBeatmapStarRating(b),
                    )
                    .sort((a, b) => a.mode_int - b.mode_int)
                    .map(difficulty => (
                      <div className="px-0.5 py-1" key={difficulty.id}>
                        <DifficultyIcon
                          difficulty={difficulty}
                          className="rounded-full text-sm"
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
