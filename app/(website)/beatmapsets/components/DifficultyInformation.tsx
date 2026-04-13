import { AnimatePresence, motion } from "framer-motion";
import { Clock9, Music, Pause, Play, Star } from "lucide-react";
import { useEffect, useState } from "react";

import AudioProgressBar from "@/components/AudioProgressBar";
import ProgressBar from "@/components/ProgressBar";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import useAudioPlayer from "@/lib/hooks/useAudioPlayer";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapResponse } from "@/lib/types/api";
import { GameMode } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { gameModeToVanilla } from "@/lib/utils/gameMode.util";
import { getBeatmapStarRating } from "@/lib/utils/getBeatmapStarRating";
import { SecondsToString } from "@/lib/utils/secondsTo";

interface DifficultyInformationProps {
  beatmap: BeatmapResponse;
  activeMode: GameMode;
}

function MorphValue({ value, className }: { value: string | number; className?: string }) {
  return (
    <span className={cn("relative inline-flex overflow-hidden", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={String(value)}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function DifficultyInformation({
  beatmap,
  activeMode,
}: DifficultyInformationProps) {
  const t = useT("pages.beatmapsets.components.difficultyInformation");
  const { isPlaying, isPlayingThis, pause, play } = useAudioPlayer();

  const [isPlayingCurrent, setIsPlayingCurrent] = useState(false);

  useEffect(() => {
    setIsPlayingCurrent(isPlayingThis(`${beatmap.beatmapset_id}.mp3`));
  }, [beatmap.beatmapset_id, isPlaying, isPlayingThis]);

  const isCurrentGamemode = (gamemodes: GameMode | GameMode[]) =>
    [gamemodes].flat().includes(gameModeToVanilla(activeMode));

  const possibleKeysValue = beatmap.version
    .match(/\d+k/gi)?.[0]
    .replaceAll(/k/gi, "");

  return (
    <div className="flex flex-col space-y-2 rounded-xl bg-secondary p-3">
      <Button
        onClick={() => {
          if (isPlaying && isPlayingCurrent) {
            pause();
            return;
          }
          play(`https://b.ppy.sh/preview/${beatmap.beatmapset_id}.mp3`, {
            id: beatmap.beatmapset_id,
            title: beatmap.title ?? "Unknown",
            artist: beatmap.artist ?? "Unknown",
            bpm: beatmap.bpm,
          });
        }}
        size="sm"
        variant="ghost"
        className={cn(
          "relative min-h-8 w-full overflow-hidden rounded-lg bg-white/5 px-6 py-1 text-xs transition-all hover:bg-white/10",
          isPlayingCurrent && "bg-white/5",
        )}
      >
        {isPlayingCurrent ? <Pause className="h-5" /> : <Play className="h-5" />}
        <AudioProgressBar
          audioId={beatmap.beatmapset_id}
          className="absolute bottom-0 left-0 h-1 w-full"
        />
      </Button>

      <div className="flex items-center justify-center space-x-4 py-1 text-sm">
        <Tooltip content={t("tooltips.totalLength")}>
          <p className="flex items-center gap-1">
            <Clock9 className="size-3.5" />
            <MorphValue value={SecondsToString(beatmap.total_length)} />
          </p>
        </Tooltip>
        <Tooltip content={t("tooltips.bpm")}>
          <p className="flex items-center gap-1">
            <Music className="size-3.5" />
            <MorphValue value={beatmap.bpm} />
          </p>
        </Tooltip>
        <Tooltip content={t("tooltips.starRating")}>
          <p className="flex items-center gap-1">
            <Star className="size-3.5" />
            <MorphValue value={getBeatmapStarRating(beatmap, activeMode).toFixed(2)} />
          </p>
        </Tooltip>
      </div>

      <div className="h-px bg-white/10" />

      <div className="flex flex-col space-y-1.5">
        {possibleKeysValue && isCurrentGamemode(GameMode.MANIA) && (
          <StatBar
            title={t("labels.keyCount")}
            value={Number.parseInt(possibleKeysValue || "4", 10)}
          />
        )}
        {isCurrentGamemode([GameMode.STANDARD, GameMode.CATCH_THE_BEAT]) && (
          <StatBar title={t("labels.circleSize")} value={beatmap.cs} />
        )}
        <StatBar title={t("labels.hpDrain")} value={beatmap.drain ?? 0} />
        <StatBar title={t("labels.accuracy")} value={beatmap.accuracy ?? 0} />
        {isCurrentGamemode([GameMode.STANDARD, GameMode.CATCH_THE_BEAT]) && (
          <StatBar title={t("labels.approachRate")} value={beatmap.ar ?? 0} />
        )}
      </div>
    </div>
  );
}

function StatBar({ title, value }: { title: string; value: number }) {
  return (
    <div className="flex items-center space-x-2">
      <p className="min-w-20 shrink-0 text-nowrap text-xs text-foreground/70">{title}</p>
      <ProgressBar maxValue={10} value={value} className="lg:max-w-24" />
      <MorphValue value={value.toFixed(1)} className="min-w-8 justify-end text-sm font-medium" />
    </div>
  );
}
