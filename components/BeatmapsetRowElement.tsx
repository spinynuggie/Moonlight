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
        "group relative h-16 w-full overflow-hidden rounded-xl border border-border/30 transition-all duration-300 hover:border-primary/20 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2),0_0_12px_hsl(var(--primary)/0.06)]",
        className,
      )}
    >
      <div className="absolute left-0 top-1/2 z-20 flex w-16 -translate-y-1/2 justify-center opacity-0 transition-all duration-300 ease-out group-hover:opacity-100 motion-safe:scale-95 motion-safe:group-hover:scale-100">
        <AudioPreview beatmapSet={beatmapSet} iconOnly className="size-8 min-h-8 min-w-8 p-0" />
      </div>
      <Link href={`/beatmapsets/${beatmapSet.id}`}>
        <div className="smooth-transition relative flex h-full flex-col place-content-between group-hover:cursor-pointer">
          <ImageWithFallback
            src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/cover@2x.jpg`}
            alt=""
            fill={true}
            objectFit="cover"
            className="rounded-t-xl bg-muted"
            fallBackSrc="/images/unknown-beatmap-banner.jpg"
          />

          <div className="smooth-transition absolute inset-0 bg-card/70 group-hover:bg-card/50" />

          <div className="relative flex items-center">
            <div className="relative mr-4 size-16 overflow-hidden rounded-xl ring-1 ring-white/[0.06] transition-shadow duration-300 group-hover:shadow-[0_0_12px_rgba(0,0,0,0.3)]">
              <ImageWithFallback
                src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/list@2x.jpg`}
                alt=""
                fill={true}
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-110"
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
                    <h3
                      className="truncate text-base font-semibold text-white"
                      style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.6)" }}
                    >
                      {beatmapSet.artist} - {beatmapSet.title}
                    </h3>
                  </div>
                </div>
                <p className="truncate text-[11px] text-muted-foreground">
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
