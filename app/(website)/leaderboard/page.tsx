"use client";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { useUserColumns } from "@/app/(website)/leaderboard/components/UserColumns";
import { UserDataTable } from "@/app/(website)/leaderboard/components/UserDataTable";
import { FilterOption, TopPlaysFilters } from "@/app/(website)/topplays/components/TopPlaysFilters";
import { LeaderboardTableSkeleton } from "@/components/Skeletons/Scores/LeaderboardTableSkeleton";
import { GameRuleFlags, GameRulesGameModes } from "@/lib/hooks/api/types";
import { useUsersLeaderboard } from "@/lib/hooks/api/user/useUsersLeaderboard";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { useT } from "@/lib/i18n/utils";
import { GameMode, LeaderboardSortType } from "@/lib/types/api";
import { gameModeToGamerule, gameModeToVanilla } from "@/lib/utils/gameMode.util";
import { isInstance, tryParseNumber } from "@/lib/utils/type.util";

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

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      `${pathname}?${createQueryString("type", leaderboardType.toString())}`,
    );
  }, [leaderboardType, pathname, createQueryString]);

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      `${pathname}?${createQueryString("mode", activeMode.toString())}`,
    );
  }, [activeMode, pathname, createQueryString]);

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      `${pathname}?${createQueryString("size", pagination.pageSize.toString())}`,
    );
  }, [pagination.pageSize, pathname, createQueryString]);

  useEffect(() => {
    window.history.replaceState(
      null,
      "",
      `${pathname
        }?${
        createQueryString("page", pagination.pageIndex.toString())}`,
    );
  }, [pagination.pageIndex, pathname, createQueryString]);

  const usersLeaderboardQuery = useUsersLeaderboard(
    activeMode,
    leaderboardType,
    pagination.pageIndex + 1,
    pagination.pageSize,
  );

  const [isCrossfading, setIsCrossfading] = useState(false);

  const handleModeChange = useCallback((mode: GameMode) => {
    if (mode !== activeMode) {
      setIsCrossfading(true);
    }
    setActiveMode(mode);
  }, [activeMode]);

  const handleTypeChange = useCallback((type: LeaderboardSortType) => {
    if (type !== leaderboardType) {
      setIsCrossfading(true);
    }
    setLeaderboardType(type);
  }, [leaderboardType]);

  const prevPageRef = useRef(pagination.pageIndex);
  const prevSizeRef = useRef(pagination.pageSize);

  useEffect(() => {
    if (prevPageRef.current !== pagination.pageIndex || prevSizeRef.current !== pagination.pageSize) {
      setIsCrossfading(true);
      prevPageRef.current = pagination.pageIndex;
      prevSizeRef.current = pagination.pageSize;
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    if (!usersLeaderboardQuery.isValidating && isCrossfading) {
      setIsCrossfading(false);
    }
  }, [usersLeaderboardQuery.isValidating, isCrossfading]);

  useScrollReveal();

  const usersLeaderboard = usersLeaderboardQuery.data;

  const { users, total_count } = usersLeaderboard ?? {
    users: [],
    total_count: 0,
  };

  const dataFingerprint = users.length > 0
    ? users.map(u => u.user.user_id).join("-")
    : "empty";

  const userColumns = useUserColumns();

  const vanilla = gameModeToVanilla(activeMode);
  const gamerule = gameModeToGamerule(activeMode);
  const sortPillOffset = Object.keys(GameRulesGameModes[gamerule] ?? {}).length
    + Object.keys(GameRuleFlags[vanilla] ?? {}).length;

  return (
    <div className="flex w-full flex-col space-y-2">
      {/* Filter panel */}
      <div className="overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md">
        <div className="grid gap-x-3 gap-y-1.5 px-3 py-2.5 md:grid-cols-[auto_1fr]">
          <TopPlaysFilters
            activeMode={activeMode}
            onModeChange={handleModeChange}
            className="contents"
          />

          <span
            className="pt-0.5 text-[13px] font-medium text-muted-foreground"
            style={{ animation: `fade-in 150ms ease-out ${sortPillOffset * 30}ms backwards` }}
          >
            {t("sortLabel")}
          </span>
          <div className="flex flex-wrap gap-0.5">
            <FilterOption
              label={t("sortBy.performancePoints")}
              active={leaderboardType === LeaderboardSortType.PP}
              onClick={() => handleTypeChange(LeaderboardSortType.PP)}
              index={sortPillOffset}
            />
            <FilterOption
              label={t("sortBy.rankedScore")}
              active={leaderboardType === LeaderboardSortType.SCORE}
              onClick={() => handleTypeChange(LeaderboardSortType.SCORE)}
              index={sortPillOffset + 1}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="scroll-reveal overflow-hidden rounded-[10px] border border-border/50 bg-card p-4 shadow-md">
        {usersLeaderboardQuery.isLoading && users.length === 0 ? (
          <LeaderboardTableSkeleton rows={pagination.pageSize} />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={dataFingerprint}
              initial={{ opacity: 0 }}
              animate={{ opacity: isCrossfading ? 0.3 : 1 }}
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
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
