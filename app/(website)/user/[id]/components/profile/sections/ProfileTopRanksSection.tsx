"use client";

import { GripVertical, Pin, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  AnimatedListItem,
  useStaggerAnimation,
} from "@/app/(website)/user/[id]/components/profile/AnimatedListItem";
import { ProfileScoreRow } from "@/app/(website)/user/[id]/components/profile/ProfileScoreRow";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  useReorderPinnedScores,
  useUserPinnedScores,
} from "@/lib/hooks/api/user/useUserProfile";
import { useUserScores } from "@/lib/hooks/api/user/useUserScores";
import useSelf from "@/lib/hooks/useSelf";
import type { GameMode } from "@/lib/types/api";
import { ScoreTableType } from "@/lib/types/api";
import { isUserHasAdminPrivilege } from "@/lib/utils/userPrivileges.util";

interface ProfileTopRanksSectionProps {
  userId: number;
  gameMode: GameMode;
}

export function ProfileTopRanksSection({
  userId,
  gameMode,
}: ProfileTopRanksSectionProps) {
  const { self } = useSelf();
  const { toast } = useToast();

  const pinnedQuery = useUserPinnedScores(userId, gameMode, 5);
  const bestQuery = useUserScores(userId, gameMode, ScoreTableType.BEST, 5, {
    revalidateOnFocus: false,
  });
  const firstPlaceQuery = useUserScores(userId, gameMode, ScoreTableType.TOP, 5, {
    revalidateOnFocus: false,
  });

  const pinnedScores = useMemo(
    () => pinnedQuery.data?.flatMap(page => page.scores) ?? [],
    [pinnedQuery.data],
  );
  const pinnedTotal = pinnedQuery.data?.find(page => page.total_count !== undefined)?.total_count ?? 0;
  const bestScores = bestQuery.data?.flatMap(page => page.scores) ?? [];
  const bestTotal = bestQuery.data?.find(page => page.total_count !== undefined)?.total_count ?? 0;
  const firstPlaceScores = firstPlaceQuery.data?.flatMap(page => page.scores) ?? [];
  const firstPlaceTotal = firstPlaceQuery.data?.find(page => page.total_count !== undefined)?.total_count ?? 0;

  const canEditPinned = Boolean(
    (self?.user_id === userId || (self && isUserHasAdminPrivilege(self)))
    && pinnedScores.length > 1,
  );

  const reorderPinnedScores = useReorderPinnedScores(userId);
  const [localPinnedScores, setLocalPinnedScores] = useState(pinnedScores);
  const [draggingScoreId, setDraggingScoreId] = useState<number | null>(null);

  const pinnedAnimateFrom = useStaggerAnimation(localPinnedScores.length);
  const bestAnimateFrom = useStaggerAnimation(bestScores.length);
  const firstPlaceAnimateFrom = useStaggerAnimation(firstPlaceScores.length);

  useEffect(() => {
    setLocalPinnedScores(pinnedScores);
  }, [pinnedScores]);

  const movePinnedScore = async (targetScoreId: number) => {
    if (draggingScoreId == null || draggingScoreId === targetScoreId)
      return;

    const sourceIndex = localPinnedScores.findIndex(score => score.id === draggingScoreId);
    const targetIndex = localPinnedScores.findIndex(score => score.id === targetScoreId);

    if (sourceIndex === -1 || targetIndex === -1)
      return;

    const next = [...localPinnedScores];
    const [movedScore] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, movedScore);
    setLocalPinnedScores(next);
    setDraggingScoreId(null);

    try {
      await reorderPinnedScores.trigger({
        score_ids: next.map(score => score.id),
      });
    }
    catch (error) {
      toast({
        title: error instanceof Error ? error.message : "Failed to reorder pinned scores",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <ScoreBlock
        title="Pinned Scores"
        count={pinnedTotal}
        emptyText="No pinned scores yet."
        showMore={localPinnedScores.length < pinnedTotal}
        onShowMore={() => pinnedQuery.setSize(pinnedQuery.size + 1)}
      >
        {localPinnedScores.map((score, index) => (
          <AnimatedListItem key={score.id} index={index} animateFrom={pinnedAnimateFrom}>
            <ProfileScoreRow
              score={score}
              metricValue={`${Math.round(score.performance_points)}pp`}
              metricLabel="pinned"
              dragEnabled={canEditPinned}
              onDragStart={() => setDraggingScoreId(score.id)}
              onDragEnter={() => movePinnedScore(score.id)}
              onDrop={() => movePinnedScore(score.id)}
            />
          </AnimatedListItem>
        ))}
      </ScoreBlock>

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

      {canEditPinned && (
        <div className="rounded-[14px] border border-border/40 bg-secondary/30 px-4 py-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <GripVertical className="size-4" />
            Drag pinned rows to change their order.
          </div>
        </div>
      )}
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
            <Pin />
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
