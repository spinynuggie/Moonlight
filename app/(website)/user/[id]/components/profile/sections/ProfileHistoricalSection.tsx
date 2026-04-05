"use client";

import { BarChart3, History, PlayCircle } from "lucide-react";

import BeatmapPlayedOverview from "@/app/(website)/user/[id]/components/BeatmapPlayedOverview";
import {
  AnimatedListItem,
  useStaggerAnimation,
} from "@/app/(website)/user/[id]/components/profile/AnimatedListItem";
import { ProfileScoreRow } from "@/app/(website)/user/[id]/components/profile/ProfileScoreRow";
import UserPlayHistoryChart from "@/app/(website)/user/[id]/components/UserPlayHistoryChart";
import { Button } from "@/components/ui/button";
import { useUserMostPlayed } from "@/lib/hooks/api/user/useUserMostPlayed";
import { useUserPlayHistoryGraph } from "@/lib/hooks/api/user/useUserPlayHistoryGraph";
import { useUserScores } from "@/lib/hooks/api/user/useUserScores";
import type { GameMode } from "@/lib/types/api";
import { ScoreTableType } from "@/lib/types/api";

interface ProfileHistoricalSectionProps {
  userId: number;
  gameMode: GameMode;
}

export function ProfileHistoricalSection({
  userId,
  gameMode,
}: ProfileHistoricalSectionProps) {
  const playHistoryQuery = useUserPlayHistoryGraph(userId);
  const mostPlayedQuery = useUserMostPlayed(userId, gameMode, 5);
  const recentScoresQuery = useUserScores(userId, gameMode, ScoreTableType.RECENT, 5, {
    revalidateOnFocus: false,
  });

  const mostPlayed = mostPlayedQuery.data?.flatMap(page => page.most_played) ?? [];
  const totalMostPlayed = mostPlayedQuery.data?.find(page => page.total_count !== undefined)?.total_count ?? 0;
  const recentScores = recentScoresQuery.data?.flatMap(page => page.scores) ?? [];
  const totalRecentScores = recentScoresQuery.data?.find(page => page.total_count !== undefined)?.total_count ?? 0;

  const mostPlayedAnimateFrom = useStaggerAnimation(mostPlayed.length);
  const recentAnimateFrom = useStaggerAnimation(recentScores.length);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BarChart3 className="size-4 text-primary" />
          <span>Play History</span>
        </div>
        <div className="rounded-[14px] border border-border/40 bg-secondary/30 p-3">
          {playHistoryQuery.data && playHistoryQuery.data.snapshots.length > 0
            ? (
                <div className="profile-crossfade-in">
                  <UserPlayHistoryChart data={playHistoryQuery.data} />
                </div>
              )
            : (
                <div className="flex h-52 items-center justify-center text-sm text-muted-foreground">
                  No historical play-count data yet.
                </div>
              )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <PlayCircle className="size-4 text-primary" />
          <span>Most Played Beatmaps</span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {totalMostPlayed}
          </span>
        </div>
        {mostPlayed.length > 0
          ? (
              <div className="space-y-2">
                {mostPlayed.map((beatmap, index) => (
                  <AnimatedListItem key={beatmap.id} index={index} animateFrom={mostPlayedAnimateFrom}>
                    <BeatmapPlayedOverview
                      beatmap={beatmap}
                      playcount={beatmap.play_count}
                    />
                  </AnimatedListItem>
                ))}
              </div>
            )
          : (
              <div className="rounded-[14px] border border-dashed border-border/50 bg-secondary/25 px-4 py-6 text-sm text-muted-foreground">
                No most-played beatmaps available yet.
              </div>
            )}
        {mostPlayed.length < totalMostPlayed && (
          <div className="flex justify-center pt-1">
            <Button
              variant="secondary"
              onClick={() => mostPlayedQuery.setSize(mostPlayedQuery.size + 1)}
            >
              Show More
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <History className="size-4 text-primary" />
          <span>Recent Plays</span>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            {totalRecentScores}
          </span>
        </div>
        {recentScores.length > 0
          ? (
              <div className="space-y-2">
                {recentScores.map((score, index) => (
                  <AnimatedListItem key={score.id} index={index} animateFrom={recentAnimateFrom}>
                    <ProfileScoreRow
                      score={score}
                      metricValue={`${Math.round(score.performance_points)}pp`}
                      metricLabel="recent"
                    />
                  </AnimatedListItem>
                ))}
              </div>
            )
          : (
              <div className="rounded-[14px] border border-dashed border-border/50 bg-secondary/25 px-4 py-6 text-sm text-muted-foreground">
                No recent plays available yet.
              </div>
            )}
        {recentScores.length < totalRecentScores && (
          <div className="flex justify-center pt-1">
            <Button
              variant="secondary"
              onClick={() => recentScoresQuery.setSize(recentScoresQuery.size + 1)}
            >
              Show More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
