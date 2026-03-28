"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import GameModeSelector from "@/components/GameModeSelector";
import UserRankColor from "@/components/UserRankNumber";
import type { GameMode, UserResponse, UserStatsResponse } from "@/lib/types/api";

interface UserStickyHeaderProps {
  user: UserResponse;
  userStats: UserStatsResponse | undefined;
  activeMode: GameMode;
  setActiveMode: (mode: GameMode) => void;
  isVisible: boolean;
}

export default function UserStickyHeader({
  user,
  userStats,
  activeMode,
  setActiveMode,
  isVisible,
}: UserStickyHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    setMounted(true);
    const siteHeader = document.querySelector("header");
    if (siteHeader) {
      const updateHeight = () => {
        setHeaderHeight(siteHeader.getBoundingClientRect().height);
      };
      updateHeight();
      window.addEventListener("resize", updateHeight);
      return () => window.removeEventListener("resize", updateHeight);
    }
  }, []);

  if (!mounted)
    return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-x-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm"
          style={{ top: headerHeight }}
        >
          <div className="row-padding-max-w-2xl flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Image
                src={user.avatar_url}
                alt=""
                width={28}
                height={28}
                className="rounded-full"
              />
              <UserRankColor
                className="text-sm font-bold"
                variant="primary"
                rank={userStats?.rank ?? -1}
              >
                {user.username}
              </UserRankColor>
              {userStats?.rank && (
                <span className="text-xs text-muted-foreground">
                  #{userStats.rank.toLocaleString()}
                </span>
              )}
            </div>
            <GameModeSelector
              activeMode={activeMode}
              setActiveMode={setActiveMode}
              userDefaultGameMode={user.default_gamemode}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
