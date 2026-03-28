"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { useT } from "@/lib/i18n/utils";
import type { GameMode } from "@/lib/types/api";
import { ScoreTableType } from "@/lib/types/api";
import { cn } from "@/lib/utils";

import UserTabScores from "./UserTabScores";

interface UserTabScoresContainerProps {
  userId: number;
  gameMode: GameMode;
}

const scoreSubTabs = [
  { key: "best", type: ScoreTableType.BEST },
  { key: "recent", type: ScoreTableType.RECENT },
  { key: "firstPlaces", type: ScoreTableType.TOP },
] as const;

export default function UserTabScoresContainer({
  userId,
  gameMode,
}: UserTabScoresContainerProps) {
  const t = useT("pages.user.components.scoresTab");
  const [activeSubTab, setActiveSubTab] = useState<(typeof scoreSubTabs)[number]["key"]>("best");

  const subTabLabels: Record<string, string> = {
    best: t("bestScores"),
    recent: t("recentScores"),
    firstPlaces: t("firstPlaces"),
  };

  const activeEntry = scoreSubTabs.find(s => s.key === activeSubTab)!;

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex border-b border-border">
        {scoreSubTabs.map(sub => (
          <button
            key={sub.key}
            className={cn(
              "relative px-3 py-1.5 text-xs transition-colors",
              activeSubTab === sub.key
                ? "text-primary"
                : "text-muted-foreground hover:text-primary",
            )}
            onClick={() => setActiveSubTab(sub.key)}
          >
            {subTabLabels[sub.key]}
            {activeSubTab === sub.key && (
              <motion.span
                layoutId="score-sub-tab-indicator"
                className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-primary"
                transition={{ type: "tween", duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              />
            )}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${activeSubTab}-${gameMode}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
        >
          <UserTabScores
            gameMode={gameMode}
            userId={userId}
            type={activeEntry.type}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
