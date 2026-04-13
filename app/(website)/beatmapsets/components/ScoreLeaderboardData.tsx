import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import ScoreStats from "@/components/ScoreStats";
import { Tooltip } from "@/components/Tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserHoverCard from "@/components/UserHoverCard";
import { useDownloadReplay } from "@/lib/hooks/api/score/useDownloadReplay";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapResponse, ScoreResponse } from "@/lib/types/api";
import { getGradeColor } from "@/lib/utils/getGradeColor";
import { timeSince } from "@/lib/utils/timeSince";
import toPrettyDate from "@/lib/utils/toPrettyDate";

function getGradeBorderColor(grade: string): string {
  const colors: Record<string, string> = {
    XH: "hsl(45, 100%, 65%)",
    X: "hsl(45, 100%, 60%)",
    SH: "hsl(45, 100%, 65%)",
    S: "hsl(45, 100%, 60%)",
    A: "hsl(120, 55%, 50%)",
    B: "hsl(210, 75%, 55%)",
    C: "hsl(280, 55%, 55%)",
    D: "hsl(0, 65%, 55%)",
    F: "hsl(0, 0%, 45%)",
  };
  return colors[grade] ?? "hsl(0, 0%, 40%)";
}

export default function ScoreLeaderboardData({
  score,
  beatmap,
}: {
  score: ScoreResponse;
  beatmap: BeatmapResponse;
}) {
  return (
    <div
      className="flex flex-col items-center gap-4 overflow-hidden rounded-[10px] border border-l-[3px] border-border/50 bg-card p-4 shadow-md transition-colors duration-150 hover:border-border/80 md:flex-row md:justify-between"
      style={{ borderLeftColor: getGradeBorderColor(score.grade) }}
    >
      <div className="flex w-full items-center gap-3 md:max-w-72">
        <div className="flex flex-col items-center gap-0.5">
          <p className="text-sm font-medium text-muted-foreground">#{score.leaderboard_rank}</p>
          <p
            className={`${getGradeColor(score.grade)} text-shadow text-3xl font-bold`}
          >
            {score.grade}
          </p>
        </div>
        <Avatar className="size-12 shrink-0 border-2 border-border">
          <Suspense fallback={<AvatarFallback>UA</AvatarFallback>}>
            <Image
              src={score.user.avatar_url}
              alt=""
              width={256}
              height={256}
            />
          </Suspense>
        </Avatar>
        <div className="flex min-w-0 flex-col items-start">
          <UserHoverCard user={score.user} asChild>
            <Link
              className="font-semibold transition-colors duration-150 hover:text-primary"
              href={`/user/${score.user.user_id}`}
            >
              {score.user.username}
            </Link>
          </UserHoverCard>
          <Tooltip content={toPrettyDate(score.when_played, true)}>
            <p className="text-xs text-muted-foreground">
              {timeSince(score.when_played, undefined)}
            </p>
          </Tooltip>
          <Image
            src={`/images/flags/${score.user.country_code}.png`}
            alt="User Flag"
            className="mt-0.5 min-w-3"
            width={18}
            height={18}
          />
        </div>
        <div className="ml-auto block lg:hidden">
          <ScoreDropdownInfo score={score} />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <ScoreStats score={score} beatmap={beatmap} variant="leaderboard" />
        <div className="hidden lg:block">
          <ScoreDropdownInfo score={score} />
        </div>
      </div>
    </div>
  );
}

function ScoreDropdownInfo({ score }: { score: ScoreResponse }) {
  const t = useT("pages.beatmapsets.components.leaderboard.actions");
  const { self } = useSelf();
  const { downloadReplay } = useDownloadReplay(score.id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">{t("openMenu")}</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/score/${score.id}`}>{t("viewDetails")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={downloadReplay}
          disabled={!self || !score.has_replay}
        >
          {t("downloadReplay")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
