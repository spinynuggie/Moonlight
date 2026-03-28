"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ChartColumnIncreasing } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useUserColumns } from "@/app/(website)/leaderboard/components/UserColumns";
import { UserDataTable } from "@/app/(website)/leaderboard/components/UserDataTable";
import { Combobox } from "@/components/ComboBox";
import GameModeSelector from "@/components/GameModeSelector";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { LeaderboardTableSkeleton } from "@/components/Skeletons/Scores/LeaderboardTableSkeleton";
import { Button } from "@/components/ui/button";
import { useUsersLeaderboard } from "@/lib/hooks/api/user/useUsersLeaderboard";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { useT } from "@/lib/i18n/utils";
import { GameMode, LeaderboardSortType } from "@/lib/types/api";
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

  const comboboxValues = useMemo(
    () => [
      {
        label: t("sortBy.performancePointsShort"),
        value: LeaderboardSortType.PP,
      },
      {
        label: t("sortBy.scoreShort"),
        value: LeaderboardSortType.SCORE,
      },
    ],
    [t],
  );

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

  return (
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader
        text={t("header")}
        icon={<ChartColumnIncreasing />}
        roundBottom={true}
        className="text-nowrap"
      >
        <div className="hidden w-full place-content-end gap-x-2 lg:flex">
          <Button
            onClick={() => handleTypeChange(LeaderboardSortType.PP)}
            variant={
              leaderboardType === LeaderboardSortType.PP
                ? "default"
                : "secondary"
            }
            className={
              leaderboardType === LeaderboardSortType.PP ? "text-black" : ""
            }
          >
            {t("sortBy.performancePoints")}
          </Button>
          <Button
            onClick={() => handleTypeChange(LeaderboardSortType.SCORE)}
            variant={
              leaderboardType === LeaderboardSortType.SCORE
                ? "default"
                : "secondary"
            }
            className={
              leaderboardType === LeaderboardSortType.SCORE ? "text-black" : ""
            }
          >
            {t("sortBy.rankedScore")}
          </Button>
        </div>

        <div className="flex flex-col lg:hidden lg:flex-row">
          <p className="text-sm text-secondary-foreground">
            {t("sortBy.label")}
          </p>
          <Combobox
            activeValue={leaderboardType.toString()}
            setActiveValue={(type: any) => handleTypeChange(type)}
            values={comboboxValues}
          />
        </div>
      </PrettyHeader>

      <div>
        <PrettyHeader className="border-b-0 ">
          <GameModeSelector
            activeMode={activeMode}
            setActiveMode={handleModeChange}
          />
        </PrettyHeader>

        <div className="scroll-reveal mb-4 rounded-b-3xl border border-t-0 bg-card shadow">
          <RoundedContent className="rounded-t-xl border-none bg-card shadow-none">
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
          </RoundedContent>
        </div>
      </div>
    </div>
  );
}
