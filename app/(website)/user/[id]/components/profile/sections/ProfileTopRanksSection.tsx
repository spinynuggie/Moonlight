"use client";

import { Trophy } from "lucide-react";

import {
  AnimatedListItem,
  useStaggerAnimation,
} from "@/app/(website)/user/[id]/components/profile/AnimatedListItem";
import { ProfileScoreRow } from "@/app/(website)/user/[id]/components/profile/ProfileScoreRow";
import { Button } from "@/components/ui/button";
import { useUserScores } from "@/lib/hooks/api/user/useUserScores";
import type { GameMode } from "@/lib/types/api";
import { ScoreTableType } from "@/lib/types/api";

interface ProfileTopRanksSectionProps {
  userId: number;
  gameMode: GameMode;
}

export function ProfileTopRanksSection({
  userId,
  gameMode,
}: ProfileTopRanksSectionProps) {
  const bestQuery = useUserScores(userId, gameMode, ScoreTableType.BEST, 5, {
    revalidateOnFocus: false,
  });
  const firstPlaceQuery = useUserScores(userId, gameMode, ScoreTableType.TOP, 5, {
    revalidateOnFocus: false,
  });

  const bestScores = bestQuery.data?.flatMap(page => page.scores) ?? [];
  const bestTotal = bestQuery.data?.find(page => page.total_count !== undefined)?.total_count ?? 0;
  const firstPlaceScores = firstPlaceQuery.data?.flatMap(page => page.scores) ?? [];
  const firstPlaceTotal = firstPlaceQuery.data?.find(page => page.total_count !== undefined)?.total_count ?? 0;

  const bestAnimateFrom = useStaggerAnimation(bestScores.length);
  const firstPlaceAnimateFrom = useStaggerAnimation(firstPlaceScores.length);

  return (
    <div className="space-y-6">
      <ScoreBlock
        title="Best Performance"
        count={bestTotal}
        emptyText="No best scores recorded."
        showMore={bestScores.length < bestTotal}
        onShowMore={() => bestQuery.setSize(bestQuery.size + 1)}
      >
        {bestScores.map((score, index) => (
          <AnimatedListItem key={score.id} index={index} animateFrom={bestAnimateFrom}>
            <ProfileScoreRow
              score={score}
              metricValue={`${Math.round(score.performance_points)}pp`}
              metricLabel={`weighted ${getWeightedPercent(index)}%`}
              detailText={`#${index + 1} top play`}
            />
          </AnimatedListItem>
        ))}
      </ScoreBlock>

      <ScoreBlock
        title="First Place Ranks"
        count={firstPlaceTotal}
        emptyText="No first place ranks yet."
        showMore={firstPlaceScores.length < firstPlaceTotal}
        onShowMore={() => firstPlaceQuery.setSize(firstPlaceQuery.size + 1)}
      >
        {firstPlaceScores.map((score, index) => (
          <AnimatedListItem key={score.id} index={index} animateFrom={firstPlaceAnimateFrom}>
            <ProfileScoreRow
              score={score}
              metricValue="#1"
              metricLabel={`${Math.round(score.performance_points)}pp`}
            />
          </AnimatedListItem>
        ))}
      </ScoreBlock>
    </div>
  );
}

function ScoreBlock({
  title,
  count,
  emptyText,
  showMore,
  onShowMore,
  children,
}: {
  title: string;
  count: number;
  emptyText: string;
  showMore: boolean;
  onShowMore: () => void;
  children: React.ReactNode;
}) {
  const childArray = Array.isArray(children) ? children : [children];
  const hasRows = childArray.some(Boolean);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Trophy className="size-4 text-primary" />
        <span>{title}</span>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
          {count}
        </span>
      </div>

      {hasRows
        ? <div className="space-y-2">{children}</div>
        : (
            <div className="rounded-[14px] border border-dashed border-border/50 bg-secondary/25 px-4 py-6 text-sm text-muted-foreground">
              {emptyText}
            </div>
          )}

      {showMore && (
        <div className="flex justify-center pt-1">
          <Button variant="secondary" onClick={onShowMore}>
            Show More
          </Button>
        </div>
      )}
    </div>
  );
}

function getWeightedPercent(index: number) {
  if (index === 0)
    return 100;

  return Math.max(1, Math.round(Math.pow(0.95, index) * 1000) / 10);
}
