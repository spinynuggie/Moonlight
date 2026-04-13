import { AnimatePresence, motion } from "framer-motion";
import { FolderKanbanIcon, HistoryIcon, Trophy, User2 } from "lucide-react";
import { useState } from "react";

import { AnimatedNumber } from "@/app/(website)/user/[id]/components/AnimatedNumber";
import UserGrades from "@/app/(website)/user/[id]/components/UserGrades";
import { UserLevelProgress } from "@/app/(website)/user/[id]/components/UserLevelProgress";
import UserPlayHistoryChart from "@/app/(website)/user/[id]/components/UserPlayHistoryChart";
import UserStatsChart from "@/app/(website)/user/[id]/components/UserStatsChart";
import BBCodeTextField from "@/components/BBCode/BBCodeTextField";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserGrades } from "@/lib/hooks/api/user/useUserGrades";
import { useUserGraph } from "@/lib/hooks/api/user/useUserGraph";
import { useUserPlayHistoryGraph } from "@/lib/hooks/api/user/useUserPlayHistoryGraph";
import { useT } from "@/lib/i18n/utils";
import type { GameMode, UserResponse, UserStatsResponse } from "@/lib/types/api";
import NumberWith from "@/lib/utils/numberWith";
import { playtimeToString } from "@/lib/utils/playtimeToString";

const formatWholeNumber = (n: number) => NumberWith(Math.round(n), ",");
const formatAccuracy = (n: number) => `${n.toFixed(2)} %`;

interface UserTabGeneralProps {
  user: UserResponse;
  stats: UserStatsResponse;
  gameMode: GameMode;
}

export default function UserTabGeneral({
  user,
  stats,
  gameMode,
}: UserTabGeneralProps) {
  const t = useT("pages.user.components.generalTab");
  const [chartValue, setChartValue] = useState<"pp" | "rank">("pp");

  const userGradesQuery = useUserGrades(user.user_id, gameMode);
  const userGraphQuery = useUserGraph(user.user_id, gameMode);

  const userPlayHistoryGraphQuery = useUserPlayHistoryGraph(user.user_id);

  const userGrades = userGradesQuery.data;
  const userGraph = userGraphQuery.data;
  const userPlayHistoryGraph = userPlayHistoryGraphQuery.data;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-4">
        <div className="col-span-2 flex flex-col sm:col-span-1">
          <PrettyHeader
            text={t("info")}
            icon={<FolderKanbanIcon className="mr-2" />}
          />

          <RoundedContent className="flex h-fit flex-col rounded-b-lg p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              <div className="mb-3">
                <UserLevelProgress totalScore={stats.total_score} />
              </div>

              <div className="-mx-2 flex place-content-between items-end rounded px-2 py-0.5 transition-colors duration-150 hover:bg-accent/50">
                <p className="text-xs">{t("rankedScore")}</p>
                <div className="text-sm font-bold">
                  <AnimatedNumber value={stats.ranked_score ?? 0} format={formatWholeNumber} />
                </div>
              </div>

              <div className="-mx-2 flex place-content-between items-end rounded px-2 py-0.5 transition-colors duration-150 hover:bg-accent/50">
                <p className="text-xs">{t("hitAccuracy")}</p>
                <div className="text-sm font-bold">
                  <AnimatedNumber value={stats?.accuracy ?? 0} format={formatAccuracy} />
                </div>
              </div>

              <div className="-mx-2 flex place-content-between items-end rounded px-2 py-0.5 transition-colors duration-150 hover:bg-accent/50">
                <p className="text-xs">{t("playcount")}</p>
                <div className="text-sm font-bold">
                  <AnimatedNumber value={stats?.play_count ?? 0} format={formatWholeNumber} />
                </div>
              </div>

              <div className="-mx-2 flex place-content-between items-end rounded px-2 py-0.5 transition-colors duration-150 hover:bg-accent/50">
                <p className="text-xs">{t("totalScore")}</p>
                <div className="text-sm font-bold">
                  <AnimatedNumber value={stats?.total_score ?? 0} format={formatWholeNumber} />
                </div>
              </div>

              <div className="-mx-2 flex place-content-between items-end rounded px-2 py-0.5 transition-colors duration-150 hover:bg-accent/50">
                <p className="text-xs">{t("maximumCombo")}</p>
                <div className="text-sm font-bold">
                  <AnimatedNumber value={stats?.max_combo ?? 0} format={formatWholeNumber} />
                </div>
              </div>

              <div className="-mx-2 my-2 flex place-content-between items-end rounded px-2 py-0.5 transition-colors duration-150 hover:bg-accent/50">
                <p className="text-sm">{t("playtime")}</p>
                <div className="text-sm font-bold">
                  {playtimeToString(stats?.play_time ?? 0)}
                </div>
              </div>

              <div className="my-1 flex border-b" />

              <AnimatePresence mode="wait">
                {userGrades ? (
                  <motion.div
                    key="grades-loaded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <UserGrades grades={userGrades} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="grades-skeleton"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Skeleton className="h-12" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </RoundedContent>
        </div>

        <div className="col-span-2 flex flex-col">
          <PrettyHeader
            text={t("performance")}
            icon={<Trophy className="mr-2" />}
            className="flex-wrap px-4 py-1"
          >
            <div className="flex flex-col place-content-between items-end">
              <p className="text-sm">{t("performance")}</p>
              <p className="text-2xl font-bold text-primary">
                <AnimatedNumber value={stats?.pp ?? 0} format={formatWholeNumber} />
              </p>
            </div>
          </PrettyHeader>
          <RoundedContent>
            <AnimatePresence mode="wait">
              {userGraph ? (
                <motion.div
                  key="chart-loaded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <UserStatsChart data={userGraph} value={chartValue} />
                  <div className="flex w-full place-content-end gap-x-2 pt-2">
                    <Button
                      onClick={() => setChartValue("rank")}
                      variant={chartValue === "rank" ? "default" : "secondary"}
                    >
                      {t("showByRank")}
                    </Button>
                    <Button
                      onClick={() => setChartValue("pp")}
                      variant={chartValue === "pp" ? "default" : "secondary"}
                    >
                      {t("showByPp")}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="chart-skeleton"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Skeleton className="h-52 w-full rounded-lg" />
                  <div className="mt-2 flex justify-end gap-2">
                    <Skeleton className="h-9 w-20 rounded-md" />
                    <Skeleton className="h-9 w-16 rounded-md" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </RoundedContent>
        </div>

        {user.description && user.description.length > 0 && (
          <motion.div
            className="col-span-2 lg:col-span-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <PrettyHeader text={t("aboutMe")} icon={<User2 />} />
            <RoundedContent className="h-fit min-h-0">
              <div className="max-h-96 overflow-y-auto">
                <BBCodeTextField text={user.description} />
              </div>
            </RoundedContent>
          </motion.div>
        )}

        {(userPlayHistoryGraphQuery.isLoading || (userPlayHistoryGraph && userPlayHistoryGraph.snapshots.length > 0)) && (
          <div className="col-span-2 lg:col-span-3">
            <PrettyHeader text={t("playHistory")} icon={<HistoryIcon />} />
            <RoundedContent className="h-fit min-h-0">
              <AnimatePresence mode="wait">
                {userPlayHistoryGraph && userPlayHistoryGraph.snapshots.length > 0 ? (
                  <motion.div
                    key="play-history-loaded"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <UserPlayHistoryChart data={userPlayHistoryGraph} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play-history-skeleton"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Skeleton className="h-52 w-full rounded-lg" />
                  </motion.div>
                )}
              </AnimatePresence>
            </RoundedContent>
          </div>
        )}
      </div>
    </div>
  );
}
