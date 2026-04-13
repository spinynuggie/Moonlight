import { Tooltip } from "@/components/Tooltip";
import type { BeatmapResponse, ScoreResponse } from "@/lib/types/api";
import { GameMode } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import numberWith from "@/lib/utils/numberWith";
import { timeSince } from "@/lib/utils/timeSince";
import toPrettyDate from "@/lib/utils/toPrettyDate";

interface Props {
  score: ScoreResponse;
  variant: scoreStatsVariant;
  beatmap?: BeatmapResponse;
}

type scoreStatsVariant = "score" | "leaderboard";

export default function ScoreStats({ score, beatmap, variant }: Props) {
  return (
    <div className={cn("flex flex-col text-foreground", variant === "score" ? "space-y-2" : "space-y-1")}>
      <div
        className={cn(
          "grid",
          variant === "leaderboard"
            ? "grid-cols-4 gap-1 text-base"
            : "grid-cols-3 gap-1.5",
        )}
      >
        {variant === "leaderboard" && (
          <DataBox title="Score" variant={variant}>
            {numberWith(score.total_score, ",")}
          </DataBox>
        )}

        <DataBox title="Accuracy" variant={variant}>
          <p className={score.accuracy === 100 ? "text-primary" : ""}>
            {score.accuracy.toFixed(2)}%
          </p>
        </DataBox>
        <DataBox title="Combo" variant={variant}>
          <p
            className={
              score.max_combo === beatmap?.max_combo ? "text-primary" : ""
            }
          >
            {score.max_combo}x
          </p>
        </DataBox>
        <DataBox title="PP" variant={variant}>
          {score.performance_points.toFixed(2)}
          {beatmap && !beatmap.is_ranked && (
            <Tooltip content="If ranked">
              <span className="ml-1 text-yellow-500">*</span>
            </Tooltip>
          )}
        </DataBox>
      </div>

      <div
        className={cn(
          variant === "leaderboard"
            ? "flex flex-col place-content-between md:flex-row md:gap-2"
            : "",
        )}
      >
        <ScoreGamemodeRelatedStats score={score} variant={variant}>
          {variant === "leaderboard" && (
            <DataBox title="Time" variant={variant}>
              <Tooltip content={toPrettyDate(score.when_played, true)} className="text-base">
                {timeSince(score.when_played, undefined, true)}
              </Tooltip>
            </DataBox>
          )}
          {variant === "leaderboard" && (
            <DataBox title="Mods" variant={variant} value={score.mods ?? ""} />
          )}
        </ScoreGamemodeRelatedStats>
      </div>
    </div>
  );
}

function ScoreGamemodeRelatedStats({
  score,
  variant,
  children,
}: {
  score: ScoreResponse;
  variant: scoreStatsVariant;
  children: React.ReactNode;
}) {
  if (score.game_mode === GameMode.STANDARD) {
    return (
      <div
        className={cn(
          "grid",
          variant === "leaderboard"
            ? "grid-cols-4 gap-1 md:grid-cols-6"
            : "grid-cols-4 gap-1.5",
        )}
      >
        <DataBox title="Great" value={score.count_300} variant={variant} />
        <DataBox title="Ok" value={score.count_100} variant={variant} />
        <DataBox title="Meh" value={score.count_50} variant={variant} />
        <DataBox title="Miss" value={score.count_miss} variant={variant} />
        {children}
      </div>
    );
  }

  if (score.game_mode === GameMode.TAIKO) {
    return (
      <div
        className={cn(
          "grid",
          variant === "leaderboard"
            ? "grid-cols-3 gap-1 md:grid-cols-5"
            : "grid-cols-3 gap-1.5",
        )}
      >
        <DataBox title="Great" value={score.count_300} variant={variant} />
        <DataBox title="Miss" value={score.count_miss} variant={variant} />
        <DataBox title="Ok" value={score.count_100} variant={variant} />
        {children}
      </div>
    );
  }

  if (score.game_mode === GameMode.CATCH_THE_BEAT) {
    return (
      <div className="">
        <div
          className={cn(
            "grid",
            variant === "leaderboard"
              ? "grid-cols-4 gap-1 md:grid-cols-6"
              : "grid-cols-4 gap-1.5",
          )}
        />
        <DataBox title="Great" value={score.count_300} variant={variant} />
        <DataBox title="Miss" value={score.count_miss} variant={variant} />
        <DataBox
          title="Large Droplet"
          value={score.count_100}
          variant={variant}
        />
        <DataBox
          title="Small Droplet"
          value={score.count_50}
          variant={variant}
        />
        {children}
      </div>
    );
  }

  if (score.game_mode === GameMode.MANIA) {
    return (
      <div
        className={cn(
          "grid",
          variant === "leaderboard"
            ? "grid-cols-6 gap-1 md:grid-cols-8"
            : "grid-cols-6 gap-1.5",
        )}
      >
        <DataBox title="Perfect" value={score.count_geki} variant={variant} />
        <DataBox title="Great" value={score.count_300} variant={variant} />
        <DataBox title="Good" value={score.count_katu} variant={variant} />
        <DataBox title="Ok" value={score.count_100} variant={variant} />
        <DataBox title="Meh" value={score.count_50} variant={variant} />
        <DataBox title="Miss" value={score.count_miss} variant={variant} />
        {children}
      </div>
    );
  }
}

function DataBox({
  title,
  variant,
  value,
  children,
}: {
  title: string;
  variant: scoreStatsVariant;
  value?: string | number;
  children?: React.ReactNode;
}) {
  const isScore = variant === "score";
  return (
    <div
      className={cn(
        "rounded text-center text-card-foreground",
        isScore
          ? "rounded-[10px] border border-border/50 bg-secondary p-3 shadow-sm"
          : "p-1",
      )}
    >
      <p
        className={cn(
          isScore
            ? "text-xs font-medium uppercase tracking-wider text-muted-foreground"
            : "text-sm text-card-foreground/50 sm:text-base",
        )}
      >
        {title}
      </p>
      <p className={cn("text-base", isScore && "font-semibold")}>{value}</p>
      {children}
    </div>
  );
}
