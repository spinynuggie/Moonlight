"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { useUserColumns } from "@/app/(website)/leaderboard/components/UserColumns";
import { UserDataTable } from "@/app/(website)/leaderboard/components/UserDataTable";
import { TopPlaysFilters } from "@/app/(website)/topplays/components/TopPlaysFilters";
import { FilterOption } from "@/components/FilterOption";
import { FilterPanel } from "@/components/FilterPanel";
import { LeaderboardTableSkeleton } from "@/components/Skeletons/Scores/LeaderboardTableSkeleton";
import { useUsersLeaderboard } from "@/lib/hooks/api/user/useUsersLeaderboard";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { useT } from "@/lib/i18n/utils";
import { GameMode, LeaderboardSortType } from "@/lib/types/api";
import { isInstance, tryParseNumber } from "@/lib/utils/type.util";

let leaderboardHasLoaded = false;

export default function Leaderboard() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useT("pages.leaderboard");

  const page = tryParseNumber(searchParams.get("page")) ?? 0;
  const size = tryParseNumber(searchParams.get("size")) ?? 10;
  const mode = searchParams.get("mode") ?? GameMode.STANDARD;
  const type = searchParams.get("type") ?? LeaderboardSortType.PP;

  const [activeMode, setActiveMode] = useState(
    () => (isInstance(mode, GameMode) ? (mode as GameMode) : GameMode.STANDARD),
  );

  const [leaderboardType, setLeaderboardType] = useState(
    () => (isInstance(type, LeaderboardSortType)
      ? (type as LeaderboardSortType)
      : LeaderboardSortType.PP),
  );

  const [pagination, setPagination] = useState({
    pageIndex: page,
    pageSize: size,
  });

  const lastUrlRef = useRef("");

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("mode", activeMode.toString());
    params.set("type", leaderboardType.toString());
    params.set("page", pagination.pageIndex.toString());
    params.set("size", pagination.pageSize.toString());
    const nextUrl = `${pathname}?${params.toString()}`;
    if (nextUrl !== lastUrlRef.current) {
      lastUrlRef.current = nextUrl;
      window.history.replaceState(null, "", nextUrl);
    }
  }, [pathname, activeMode, leaderboardType, pagination.pageIndex, pagination.pageSize]);

  const usersLeaderboardQuery = useUsersLeaderboard(
    activeMode,
    leaderboardType,
    pagination.pageIndex + 1,
    pagination.pageSize,
  );

  const handleModeChange = useCallback((mode: GameMode) => {
    setActiveMode(mode);
  }, []);

  const handleTypeChange = useCallback((type: LeaderboardSortType) => {
    setLeaderboardType(type);
  }, []);

  useScrollReveal();

  const usersLeaderboard = usersLeaderboardQuery.data;

  const { users, total_count } = usersLeaderboard ?? {
    users: [],
    total_count: 0,
  };

  const hasData = users.length > 0;
  const isDimming = usersLeaderboardQuery.isLoading && hasData;

  useEffect(() => {
    if (hasData)
      leaderboardHasLoaded = true;
  }, [hasData]);

  const userColumns = useUserColumns();

  return (
    <div className="flex w-full flex-col space-y-2">
      {/* Filter panel */}
      <FilterPanel>
        <div className="grid gap-x-4 gap-y-2.5 px-4 py-3 md:grid-cols-[auto_1fr]">
          <TopPlaysFilters
            activeMode={activeMode}
            onModeChange={handleModeChange}
            className="contents"
          />

          <span
            className="self-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50"
            style={{ animation: "fade-in 300ms ease-out 200ms backwards" }}
          >
            {t("sortLabel")}
          </span>
          <div className="flex flex-wrap gap-1">
            <FilterOption
              label={t("sortBy.performancePoints")}
              active={leaderboardType === LeaderboardSortType.PP}
              onClick={() => handleTypeChange(LeaderboardSortType.PP)}
              index={0}
            />
            <FilterOption
              label={t("sortBy.rankedScore")}
              active={leaderboardType === LeaderboardSortType.SCORE}
              onClick={() => handleTypeChange(LeaderboardSortType.SCORE)}
              index={1}
            />
          </div>
        </div>
      </FilterPanel>

      {/* Table */}
      <div className="scroll-reveal overflow-hidden rounded-[10px] border border-border/50 bg-card p-4 shadow-md">
        <AnimatePresence mode="wait" initial={false}>
          {usersLeaderboardQuery.isLoading && !hasData && !leaderboardHasLoaded ? (
            <motion.div
              key="leaderboard-skeleton"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <LeaderboardTableSkeleton rows={pagination.pageSize} />
            </motion.div>
          ) : (
            <motion.div
              key={`leaderboard-${activeMode}-${leaderboardType}-${pagination.pageIndex}-${pagination.pageSize}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: isDimming ? 0.5 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <UserDataTable
                columns={userColumns}
                data={users}
                pagination={pagination}
                totalCount={total_count}
                leaderboardType={leaderboardType}
                setPagination={setPagination}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
