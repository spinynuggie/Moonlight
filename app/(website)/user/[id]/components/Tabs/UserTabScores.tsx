import { ChartColumnIncreasing } from "lucide-react";

import UserScoreOverview from "@/app/(website)/user/[id]/components/UserScoreOverview";
import { ContentNotExist } from "@/components/ContentNotExist";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useUserScores } from "@/lib/hooks/api/user/useUserScores";
import { useT } from "@/lib/i18n/utils";
import type { GameMode } from "@/lib/types/api";
import { ScoreTableType } from "@/lib/types/api";

interface UserTabScoresProps {
  userId: number;
  gameMode: GameMode;
  type: ScoreTableType;
}

export default function UserTabScores({
  userId,
  gameMode,
  type,
}: UserTabScoresProps) {
  const t = useT("pages.user.components.scoresTab");
  const { data, setSize, size, isLoading } = useUserScores(
    userId,
    gameMode,
    type,
    5,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );

  const isLoadingMore
    = isLoading || (size > 0 && data && data[size - 1] === undefined);

  const scores = data?.flatMap(item => item.scores);
  let total_count = data?.find(
    item => item.total_count !== undefined,
  )?.total_count;

  if (total_count && type === ScoreTableType.BEST) {
    total_count = Math.min(100, total_count);
  }

  const sentinelRef = useInfiniteScroll(
    !!scores && scores.length < (total_count ?? 0),
    !!isLoadingMore,
    () => setSize(size + 1),
  );

  const getHeaderText = () => {
    if (type === ScoreTableType.BEST)
      return t("bestScores");
    if (type === ScoreTableType.RECENT)
      return t("recentScores");
    if (type === ScoreTableType.TOP)
      return t("firstPlaces");
    return `${type} scores`;
  };

  const getNoScoresText = () => {
    if (type === ScoreTableType.BEST)
      return t("noScores", { type: "best" });
    if (type === ScoreTableType.RECENT)
      return t("noScores", { type: "recent" });
    if (type === ScoreTableType.TOP)
      return t("noScores", { type: "first places" });
  };

  return (
    <div className="flex flex-col">
      <PrettyHeader
        text={getHeaderText()}
        icon={<ChartColumnIncreasing />}
        counter={total_count && total_count > 0 ? total_count : undefined}
      />
      <RoundedContent className="h-fit max-h-none min-h-60">
        {scores && total_count !== undefined && (
          <div>
            {scores.length <= 0 && <ContentNotExist text={getNoScoresText()} />}
            {scores.map((score, i) => (
              <div
                key={`score-${score.id}`}
                className="mb-2 duration-300 animate-in fade-in"
                style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
              >
                <UserScoreOverview score={score} />
              </div>
            ))}
            {scores.length < total_count && (
              <div ref={sentinelRef} className="h-1" />
            )}
            {isLoadingMore && (
              <div className="space-y-2">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={`loading-${i}`} className="skeleton-shimmer h-20 rounded-lg" />
                ))}
              </div>
            )}
          </div>
        )}
      </RoundedContent>
    </div>
  );
}
