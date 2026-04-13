import { Tooltip } from "@/components/Tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import UserRankColor from "@/components/UserRankNumber";
import { useT } from "@/lib/i18n/utils";
import type { UserStatsResponse } from "@/lib/types/api";
import toPrettyDate from "@/lib/utils/toPrettyDate";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  userStats: UserStatsResponse | undefined;
}

export default function UserRanks({ userStats, ...props }: Props) {
  return (
    <div className="flex flex-row flex-wrap gap-x-5 gap-y-1" {...props}>
      <UserRank
        label="Global Ranking"
        rank={userStats?.rank}
        bestRank={userStats?.best_global_rank}
        bestRankDate={userStats?.best_global_rank_date}
        variant="primary"
      />

      <UserRank
        label="Country Ranking"
        rank={userStats?.country_rank}
        bestRank={userStats?.best_country_rank}
        bestRankDate={userStats?.best_country_rank_date}
        variant="secondary"
      />
    </div>
  );
}

function UserRank({
  rank,
  bestRank,
  bestRankDate,
  variant,
  label,
}: {
  rank: number | undefined;
  bestRank: number | undefined;
  bestRankDate: string | undefined;
  variant: "primary" | "secondary";
  label: string;
}) {
  const t = useT("pages.user.components.ranks");
  return (
    <Tooltip
      align="start"
      content={
        bestRankDate ? (
          <div className="w-32 text-xs md:w-fit md:text-sm ">
            {t.rich("highestRank", {
              rank: bestRank ?? 0,
              date: toPrettyDate(bestRankDate),
              rankValue: chunks => (
                <UserRankColor
                  className="inline"
                  variant={variant}
                  rank={bestRank ?? -1}
                >
                  #{chunks}
                </UserRankColor>
              ),
            })}
          </div>
        ) : (
          ""
        )
      }
    >
      <div className="flex flex-col">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          {label}
        </span>
        <UserRankColor
          className="flex flex-nowrap text-lg font-bold md:text-2xl"
          variant={variant}
          rank={rank ?? -1}
        >
          {rank ? (
            <span className="duration-300 animate-in fade-in">#{rank.toLocaleString()}</span>
          ) : (
            <><span>#</span><Skeleton className="ml-1 h-5 w-3 md:ml-2 md:h-6 md:w-9" /></>
          )}
        </UserRankColor>
      </div>
    </Tooltip>
  );
}
