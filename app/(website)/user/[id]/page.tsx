"use client";

import { Edit3Icon, LucideSettings, User as UserIcon } from "lucide-react";
import Image from "next/image";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

import { SetDefaultGamemodeButton } from "@/app/(website)/user/[id]/components/SetDefaultGamemodeButton";
import UserTabGeneral from "@/app/(website)/user/[id]/components/Tabs/UserTabGeneral";
import UserTabScores from "@/app/(website)/user/[id]/components/Tabs/UserTabScores";
import UserGeneralInformation from "@/app/(website)/user/[id]/components/UserGeneralInformation";
import UserPreviousUsernamesTooltip from "@/app/(website)/user/[id]/components/UserPreviousUsernamesTooltip";
import UserPrivilegeBadges from "@/app/(website)/user/[id]/components/UserPrivilegeBadges";
import UserRanks from "@/app/(website)/user/[id]/components/UserRanks";
import UserSocials from "@/app/(website)/user/[id]/components/UserSocials";
import UserStatusText from "@/app/(website)/user/[id]/components/UserStatusText";
import { FriendshipButton } from "@/components/FriendshipButton";
import GameModeSelector from "@/components/GameModeSelector";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import ImageWithFallback from "@/components/ImageWithFallback";
import { UserProfileSkeleton } from "@/components/Skeletons/Users/UserProfileSkeleton";
import { Tooltip } from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
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
import { GameMode, ScoreTableType } from "@/lib/types/api";
import { getStatusColor } from "@/lib/utils/getStatusColor";
import { isInstance, tryParseNumber } from "@/lib/utils/type.util";
import { isUserHasAdminPrivilege } from "@/lib/utils/userPrivileges.util";

import UserTabBeatmaps from "./components/Tabs/UserTabBeatmaps";
import UserTabMedals from "./components/Tabs/UserTabMedals";

export default function UserPage() {
  const params = useParams<{ id: string }>();
  const userId = tryParseNumber(params.id) ?? 0;
  const t = useT("pages.user");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") ?? "";

  const contentTabs = [
    "tabs.general",
    "tabs.bestScores",
    "tabs.recentScores",
    "tabs.firstPlaces",
    "tabs.beatmaps",
    "tabs.medals",
  ];

  const [activeTab, setActiveTab] = useState("tabs.general");
  const [activeMode, setActiveMode] = useState<GameMode | null>(
    () => (isInstance(mode, GameMode) ? (mode as GameMode) : null),
  );

  const { self } = useSelf();

  const isOwnProfile = userId === self?.user_id;

  const selfUserQuery = useUserSelf();
  const otherUserQuery = useUser(userId);

  const userQuery = isOwnProfile ? selfUserQuery : otherUserQuery;
  const userStatsQuery = useUserStats(userId, activeMode);
  const userMetadataQuery = useUserMetadata(userId);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const renderTabContent = useCallback(
    (
      userStats: UserStatsResponse | undefined,
      activeTab: string,
      activeMode: GameMode,
      user: UserResponse,
    ) => {
      if (!userStats)
        return null;

      if (activeTab === "tabs.general") {
        return (
          <UserTabGeneral
            key={`general-${activeMode}`}
            user={user}
            stats={userStats}
            gameMode={activeMode}
          />
        );
      }
      if (activeTab === "tabs.bestScores") {
        return (
          <UserTabScores
            key={`best-${activeMode}`}
            gameMode={activeMode}
            userId={user.user_id}
            type={ScoreTableType.BEST}
          />
        );
      }
      if (activeTab === "tabs.recentScores") {
        return (
          <UserTabScores
            key={`recent-${activeMode}`}
            gameMode={activeMode}
            userId={user.user_id}
            type={ScoreTableType.RECENT}
          />
        );
      }
      if (activeTab === "tabs.firstPlaces") {
        return (
          <UserTabScores
            key={`first-${activeMode}`}
            gameMode={activeMode}
            userId={user.user_id}
            type={ScoreTableType.TOP}
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

    window.history.replaceState(
      null,
      "",
      `${pathname}?${createQueryString("mode", activeMode.toString())}`,
    );
  }, [activeMode, createQueryString, pathname]);

  useEffect(() => {
    if (activeMode || !userQuery.data)
      return;
    setActiveMode(userQuery.data.default_gamemode);
  }, [userQuery.data, activeMode]);

  if (userQuery.isLoading || !userQuery.data || !activeMode) {
    return (
      <div className="flex flex-col space-y-4">
        <PrettyHeader icon={<UserIcon />} text={t("header")} roundBottom />
        <UserProfileSkeleton />
      </div>
    );
  }

  const errorMessage = userQuery.error?.message ?? t("errors.userNotFound");

  const user = userQuery.data;
  const userStats = userStatsQuery.data?.stats;
  const userMetadata = userMetadataQuery.data;

  return (
    <div className="flex flex-col space-y-4">
      <PrettyHeader icon={<UserIcon />} text={t("header")} roundBottom>
        {activeMode && (
          <SetDefaultGamemodeButton gamemode={activeMode} user={user} />
        )}
      </PrettyHeader>

      <div>
        <PrettyHeader className="border-b-0">
          {activeMode && (
            <GameModeSelector
              activeMode={activeMode}
              setActiveMode={setActiveMode}
              userDefaultGameMode={user.default_gamemode}
            />
          )}
        </PrettyHeader>

        <RoundedContent className="rounded-lg-b border-t-0 bg-card p-0">
          {!userStatsQuery.error ? (
            <div className="duration-300 animate-in fade-in">
              <div className="relative h-32 md:h-44 lg:h-64">
                <ImageWithFallback
                  src={`${user.banner_url}&default=false`}
                  alt=""
                  fill
                  objectFit="cover"
                  className="rounded-t-lg bg-black"
                  fallBackSrc="/images/placeholder.png"
                />

                <div className="absolute inset-0 flex w-full bg-gradient-to-t from-card via-transparent to-transparent">
                  <div className="relative flex flex-grow place-content-between items-end overflow-hidden px-4 py-2 md:p-6">
                    <div className="flex w-3/4 items-end space-x-4">
                      <div className="relative size-16 flex-none md:size-32">
                        <Image
                          src={user.avatar_url}
                          alt="User avatar"
                          fill
                          objectFit="cover"
                          className="rounded-full border-2 border-secondary md:border-4"
                        />
                        <div
                          className={twMerge(
                            "absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-secondary md:h-10 md:w-10 md:border-4",
                            getStatusColor(user.user_status, "bg"),
                          )}
                        />
                      </div>

                      <div className="flex min-w-0 flex-grow flex-col">
                        <div className="flex flex-row flex-wrap gap-x-2">
                          <Tooltip content={user.username} align="start">
                            <UserRankColor
                              className="truncate text-lg font-bold md:text-3xl"
                              variant="primary"
                              rank={userStats?.rank ?? -1}
                            >
                              {user.username}
                            </UserRankColor>
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
                        onClick={() =>
                          router.push(`/admin/users/${user.user_id}/edit`)}
                      >
                        <LucideSettings />
                      </Button>
                    )}
                  </div>
                </div>

                {userMetadata && <UserSocials metadata={userMetadata} />}

                <div className="my-2">
                  <div className="flex overflow-x-auto border-b border-border">
                    {contentTabs.map(tab => (
                      <button
                        key={tab}
                        className={twMerge(
                          "whitespace-nowrap px-4 py-2 text-xs transition-colors md:text-base",
                          activeTab === tab
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:border-b-2 hover:border-primary/50 hover:text-primary",
                        )}
                        onClick={() => setActiveTab(tab)}
                      >
                        {t(tab)}
                      </button>
                    ))}
                  </div>
                </div>

                {renderTabContent(userStats, activeTab, activeMode, user)}
              </div>
            </div>
          ) : (
            <div>{errorMessage}</div>
          )}
        </RoundedContent>
      </div>
    </div>
  );
}
