"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { Edit3Icon, LucideSettings, User as UserIcon } from "lucide-react";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { SetDefaultGamemodeButton } from "@/app/(website)/user/[id]/components/SetDefaultGamemodeButton";
import UserTabGeneral from "@/app/(website)/user/[id]/components/Tabs/UserTabGeneral";
import UserTabScoresContainer from "@/app/(website)/user/[id]/components/Tabs/UserTabScoresContainer";
import UserGeneralInformation from "@/app/(website)/user/[id]/components/UserGeneralInformation";
import UserPreviousUsernamesTooltip from "@/app/(website)/user/[id]/components/UserPreviousUsernamesTooltip";
import UserPrivilegeBadges from "@/app/(website)/user/[id]/components/UserPrivilegeBadges";
import UserRanks from "@/app/(website)/user/[id]/components/UserRanks";
import UserSocials from "@/app/(website)/user/[id]/components/UserSocials";
import UserStatusText from "@/app/(website)/user/[id]/components/UserStatusText";
import UserStickyHeader from "@/app/(website)/user/[id]/components/UserStickyHeader";
import { FriendshipButton } from "@/components/FriendshipButton";
import GameModeSelector from "@/components/GameModeSelector";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import ImageWithFallback from "@/components/ImageWithFallback";
import { UserProfileSkeleton } from "@/components/Skeletons/Users/UserProfileSkeleton";
import { UserTabGeneralSkeleton } from "@/components/Skeletons/Users/UserTabGeneralSkeleton";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import UserRankColor from "@/components/UserRankNumber";
import {
  useUser,
  useUserSelf,
  useUserStats,
} from "@/lib/hooks/api/user/useUser";
import { useUserMetadata } from "@/lib/hooks/api/user/useUserMetadata";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import type { UserResponse, UserStatsResponse } from "@/lib/types/api";
import { GameMode } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/utils/getStatusColor";
import { isInstance, tryParseNumber } from "@/lib/utils/type.util";
import { isUserHasAdminPrivilege } from "@/lib/utils/userPrivileges.util";

import UserTabBeatmaps from "./components/Tabs/UserTabBeatmaps";
import UserTabMedals from "./components/Tabs/UserTabMedals";

function getStatusGlowColor(status: string): string {
  const s = status.trim();
  if (s === "Offline")
    return "rgba(128, 128, 128, 0.3)";
  if (s === "Idle" || s === "Afk")
    return "rgba(217, 188, 140, 0.5)";
  return "rgba(140, 151, 125, 0.5)";
}

export default function UserPage() {
  const params = useParams<{ id: string }>();
  const userId = tryParseNumber(params.id) ?? 0;
  const t = useT("pages.user");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") ?? "";
  const tabParam = searchParams.get("tab") ?? "";

  const contentTabs = [
    "tabs.general",
    "tabs.scores",
    "tabs.beatmaps",
    "tabs.medals",
  ];

  const tabParamToKey: Record<string, string> = {
    general: "tabs.general",
    scores: "tabs.scores",
    bestScores: "tabs.scores",
    recentScores: "tabs.scores",
    firstPlaces: "tabs.scores",
    beatmaps: "tabs.beatmaps",
    medals: "tabs.medals",
  };

  const tabKeyToParam: Record<string, string> = {
    "tabs.general": "general",
    "tabs.scores": "scores",
    "tabs.beatmaps": "beatmaps",
    "tabs.medals": "medals",
  };

  const [activeTab, setActiveTab] = useState(
    () => tabParamToKey[tabParam] || "tabs.general",
  );

  const changeTab = useCallback((newTab: string) => {
    setActiveTab(newTab);
  }, []);

  const [activeMode, setActiveMode] = useState<GameMode | null>(
    () => (isInstance(mode, GameMode) ? (mode as GameMode) : null),
  );

  const [avatarOpen, setAvatarOpen] = useState(false);
  const [showStickyHeader, setShowStickyHeader] = useState(false);

  const bannerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const bannerY = useTransform(scrollY, [0, 500], [0, 40]);

  const { self } = useSelf();

  const isOwnProfile = userId === self?.user_id;

  const selfUserQuery = useUserSelf();
  const otherUserQuery = useUser(userId);

  const userQuery = isOwnProfile ? selfUserQuery : otherUserQuery;
  const userStatsQuery = useUserStats(userId, activeMode);
  const userMetadataQuery = useUserMetadata(userId);

  const user = userQuery.data;
  const userStats = userStatsQuery.data?.stats;
  const userMetadata = userMetadataQuery.data;
  const errorMessage = userQuery.error?.message ?? t("errors.userNotFound");

  useMotionValueEvent(scrollY, "change", () => {
    if (!bannerRef.current)
      return;
    const { bottom } = bannerRef.current.getBoundingClientRect();
    setShowStickyHeader(bottom < 60); // ~site header height
  });

  const renderTabContent = useCallback(
    (
      userStats: UserStatsResponse | undefined,
      activeTab: string,
      activeMode: GameMode,
      user: UserResponse,
    ) => {
      if (activeTab === "tabs.general") {
        if (!userStats)
          return <UserTabGeneralSkeleton />;
        return (
          <UserTabGeneral
            key={`general-${activeMode}`}
            user={user}
            stats={userStats}
            gameMode={activeMode}
          />
        );
      }

      if (activeTab === "tabs.scores") {
        return (
          <UserTabScoresContainer
            key={`scores-${activeMode}`}
            gameMode={activeMode}
            userId={user.user_id}
          />
        );
      }

      if (activeTab === "tabs.beatmaps") {
        return (
          <UserTabBeatmaps
            key={`beatmaps-${activeMode}`}
            userId={user.user_id}
            gameMode={activeMode}
          />
        );
      }

      if (activeTab === "tabs.medals") {
        return (
          <UserTabMedals
            key={`medals-${activeMode}`}
            user={user}
            gameMode={activeMode}
          />
        );
      }

      return null;
    },
    [],
  );

  useEffect(() => {
    if (!activeMode)
      return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", activeMode.toString());

    const tabValue = tabKeyToParam[activeTab];
    if (tabValue && tabValue !== "general") {
      params.set("tab", tabValue);
    }
    else {
      params.delete("tab");
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
    const currentUrl = `${pathname}?${searchParams.toString()}`;

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [activeTab, activeMode, pathname, router, searchParams, tabKeyToParam]);

  useEffect(() => {
    if (activeMode || !userQuery.data)
      return;
    setActiveMode(userQuery.data.default_gamemode);
  }, [userQuery.data, activeMode]);

  return (
    <div className="flex flex-col space-y-4">
      <PrettyHeader icon={<UserIcon />} text={t("header")} roundBottom>
        {user && activeMode && (
          <SetDefaultGamemodeButton gamemode={activeMode} user={user} />
        )}
      </PrettyHeader>

      <AnimatePresence mode="wait">
        {!user || !activeMode ? (
          <motion.div
            key="profile-skeleton"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <UserProfileSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key={`profile-${user.user_id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <PrettyHeader className="border-b-0">
                <GameModeSelector
                  activeMode={activeMode}
                  setActiveMode={(mode) => {
                    setActiveMode(mode);
                  }}
                  userDefaultGameMode={user.default_gamemode}
                />
              </PrettyHeader>

              <RoundedContent className="rounded-lg-b border-t-0 bg-card p-0">
                {!userStatsQuery.error ? (
                  <div>
                    <UserStickyHeader
                      user={user}
                      userStats={userStats}
                      activeMode={activeMode}
                      setActiveMode={(mode) => {
                        setActiveMode(mode);
                      }}
                      isVisible={showStickyHeader}
                    />

                    <div ref={bannerRef} className="relative h-44 overflow-hidden rounded-t-lg lg:h-64">
                      <motion.div
                        style={{ y: bannerY }}
                        className="absolute -inset-y-12 inset-x-0"
                      >
                        <ImageWithFallback
                          src={`${user.banner_url}&default=false`}
                          alt=""
                          fill
                          objectFit="cover"
                          className="bg-card"
                          fallBackSrc="/images/placeholder.png"
                          fadeIn
                        />
                      </motion.div>

                      <div className="absolute inset-0 flex w-full bg-gradient-to-t from-card via-transparent to-transparent">
                        <div className="relative flex flex-grow place-content-between items-end overflow-hidden px-4 py-2 md:p-6">
                          <div className="flex w-3/4 items-end space-x-4">
                            <div
                              className="group relative size-16 flex-none cursor-pointer rounded-full transition-shadow duration-200 hover:shadow-[0_0_20px_var(--status-glow)] md:size-32"
                              style={{ "--status-glow": getStatusGlowColor(user.user_status) } as React.CSSProperties}
                              onClick={() => setAvatarOpen(true)}
                            >
                              <Image
                                src={user.avatar_url}
                                alt="User avatar"
                                fill
                                objectFit="cover"
                                className="rounded-full border-2 border-secondary transition-transform duration-200 group-hover:scale-[1.08] md:border-4"
                              />
                              <div
                                className={cn(
                                  "absolute bottom-1 right-1 size-5 rounded-full border-2 border-secondary md:size-10 md:border-4",
                                  getStatusColor(user.user_status, "bg"),
                                  user.user_status !== "Offline"
                                  && "status-online-pulse",
                                )}
                              />
                            </div>

                            <div className="flex min-w-0 flex-grow flex-col">
                              <div className="flex flex-row flex-wrap gap-x-2">
                                <Tooltip content={user.username} align="start">
                                  {user.username.toLowerCase() === "asteria" ? (
                                    <div className="animate-gradient truncate bg-gradient-to-r from-primary via-foreground to-primary bg-size-300 bg-clip-text text-lg font-bold text-transparent md:text-3xl">
                                      {user.username}
                                    </div>
                                  ) : (
                                    <UserRankColor
                                      className="truncate text-lg font-bold md:text-3xl"
                                      variant="primary"
                                      rank={userStats?.rank ?? -1}
                                    >
                                      {user.username}
                                    </UserRankColor>
                                  )}
                                </Tooltip>

                                <UserPreviousUsernamesTooltip user={user} />

                                <UserPrivilegeBadges badges={[...user.badges]} small />
                              </div>

                              <UserStatusText user={user} />
                            </div>
                          </div>

                          <UserRanks user={user} userStats={userStats} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-card px-6 py-4">
                      <div>
                        <div className="flex items-start justify-between">
                          <UserGeneralInformation user={user} metadata={userMetadata} />

                          <div className="flex space-x-2">
                            {user.user_id === self?.user_id ? (
                              <Button onClick={() => router.push("/settings")}>
                                <Edit3Icon />
                              </Button>
                            ) : (
                              <FriendshipButton userId={userId} />
                            )}

                            {self && isUserHasAdminPrivilege(self) && (
                              <Button
                                onClick={() => router.push(`/admin/users/${user.user_id}/edit`)}
                              >
                                <LucideSettings />
                              </Button>
                            )}
                          </div>
                        </div>

                        <AnimatePresence>
                          {userMetadata && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <UserSocials metadata={userMetadata} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <div className="my-2">
                          <div className="flex overflow-x-auto border-b border-border">
                            {contentTabs.map(tab => (
                              <button
                                key={tab}
                                className={cn(
                                  "relative whitespace-nowrap px-4 py-2 text-xs transition-colors md:text-base",
                                  activeTab === tab
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-primary",
                                )}
                                onClick={() => changeTab(tab)}
                              >
                                {t(tab)}
                                {activeTab === tab && (
                                  <motion.span
                                    layoutId="user-profile-tab-indicator"
                                    className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-primary"
                                    transition={{ type: "tween", duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                                  />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.div
                            key={`${activeTab}-${activeMode}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                          >
                            {renderTabContent(userStats, activeTab, activeMode, user)}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>{errorMessage}</div>
                )}
              </RoundedContent>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {user && (
        <Dialog open={avatarOpen} onOpenChange={setAvatarOpen}>
          <DialogContent className="border-none bg-transparent p-0 shadow-none outline-none sm:max-w-xs md:max-w-sm [&>button]:hidden">
            <DialogTitle className="sr-only">{user.username}&apos;s avatar</DialogTitle>
            <div className="flex flex-col items-center gap-4">
              <div className="relative aspect-square w-full">
                <Image
                  src={user.avatar_url}
                  alt={`${user.username}'s avatar`}
                  fill
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{user.username}&apos;s avatar</p>
                <p className="text-xs text-muted-foreground">click anywhere to close</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
