"use client";

import {
  ChevronDown,
  ChevronUp,
  Edit3Icon,
  ImageIcon,
  LucideSettings,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { SetDefaultGamemodeButton } from "@/app/(website)/user/[id]/components/SetDefaultGamemodeButton";
import UserGeneralInformation from "@/app/(website)/user/[id]/components/UserGeneralInformation";
import { UserLevelProgress } from "@/app/(website)/user/[id]/components/UserLevelProgress";
import UserPreviousUsernamesTooltip from "@/app/(website)/user/[id]/components/UserPreviousUsernamesTooltip";
import UserPrivilegeBadges from "@/app/(website)/user/[id]/components/UserPrivilegeBadges";
import UserRanks from "@/app/(website)/user/[id]/components/UserRanks";
import UserSocials from "@/app/(website)/user/[id]/components/UserSocials";
import UserStatusText from "@/app/(website)/user/[id]/components/UserStatusText";
import { GameModeIcon } from "@/components/DifficultyIcon";
import { FilterOption } from "@/components/FilterOption";
import { FilterPanel } from "@/components/FilterPanel";
import { FriendshipButton } from "@/components/FriendshipButton";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GameRuleFlags,
  GameRulesGameModes,
} from "@/lib/hooks/api/types";
import { useUserGrades } from "@/lib/hooks/api/user/useUserGrades";
import { useUserGraph } from "@/lib/hooks/api/user/useUserGraph";
import { useUserMedals } from "@/lib/hooks/api/user/useUserMedals";
import type { ProfileUserResponse } from "@/lib/hooks/api/user/useUserProfile";
import type {
  GameMode,
  GetUserByIdMetadataResponse,
  UserResponse,
  UserStatsResponse,
} from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { gameModeToGamerule, gameModeToVanilla } from "@/lib/utils/gameMode.util";
import { timeSince } from "@/lib/utils/timeSince";
import { isUserHasAdminPrivilege } from "@/lib/utils/userPrivileges.util";

const COVER_EXPANDED_KEY = "moonlight-profile-cover-expanded";

interface ProfileSummaryProps {
  user: ProfileUserResponse;
  userStats?: UserStatsResponse;
  metadata?: GetUserByIdMetadataResponse;
  activeMode: GameMode;
  onModeSelect: (mode: GameMode) => void;
  onOpenAvatar: () => void;
  onOpenCoverEditor: () => void;
  onOpenAdmin: () => void;
  self?: UserResponse;
}

export function ProfileSummary({
  user,
  userStats,
  metadata,
  activeMode,
  onModeSelect,
  onOpenAvatar,
  onOpenCoverEditor,
  onOpenAdmin,
  self,
}: ProfileSummaryProps) {
  const [coverExpanded, setCoverExpanded] = useState(false);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(COVER_EXPANDED_KEY);
    setCoverExpanded(storedValue === "true");
  }, []);

  const toggleCoverExpanded = () => {
    setCoverExpanded((current) => {
      const next = !current;
      window.localStorage.setItem(COVER_EXPANDED_KEY, String(next));
      return next;
    });
  };

  const isOwnProfile = self?.user_id === user.user_id;
  const canEditCover = Boolean(isOwnProfile);
  const showAdminButton = Boolean(self && isUserHasAdminPrivilege(self));

  const userGraphQuery = useUserGraph(user.user_id, activeMode);
  const userGradesQuery = useUserGrades(user.user_id, activeMode);
  const userMedalsQuery = useUserMedals(user.user_id, activeMode);
  const gradesData = userGradesQuery.data;

  const medalCount = useMemo(() => {
    const medals = userMedalsQuery.data;
    if (!medals)
      return null;
    return Object.values(medals)
      .flatMap(category => category.medals)
      .filter(medal => medal.unlocked_at)
      .length;
  }, [userMedalsQuery.data]);

  const rightSideStats = [
    { label: "Ranked Score", value: userStats ? userStats.ranked_score.toLocaleString() : "—" },
    { label: "Hit Accuracy", value: userStats ? `${userStats.accuracy.toFixed(2)}%` : "—" },
    { label: "Play Count", value: userStats ? userStats.play_count.toLocaleString() : "—" },
    { label: "Total Score", value: userStats ? userStats.total_score.toLocaleString() : "—" },
    { label: "Total Hits", value: userStats ? userStats.total_hits.toLocaleString() : "—" },
    {
      label: "Hits Per Play",
      value: userStats
        ? Math.round(userStats.total_hits / Math.max(1, userStats.play_count)).toLocaleString()
        : "—",
    },
    { label: "Maximum Combo", value: userStats ? userStats.max_combo.toLocaleString() : "—" },
    { label: "Replays Watched", value: user.replay_watch_count?.toLocaleString() ?? "—" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div className="mb-2">
        <FilterPanel>
          <div className="px-4 py-3">
            <ModeFilters
              activeMode={activeMode}
              onModeChange={onModeSelect}
              user={user}
            />
          </div>
        </FilterPanel>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-border/50 shadow-md">
        <div
          className={cn(
            "relative overflow-hidden bg-cover bg-center transition-[height] duration-300",
            coverExpanded ? "h-[250px]" : "h-[100px] md:h-[250px]",
          )}
        >
          <ImageWithFallback
            src={`${user.banner_url}&default=false`}
            alt=""
            fill
            sizes="1000px"
            quality={90}
            className="bg-card"
            fallBackSrc="/images/placeholder.png"
            fadeIn
            style={{ objectFit: "cover" }}
          />
          {(showAdminButton || canEditCover) && (
            <div className="absolute bottom-[10px] right-[10px] flex items-center gap-2 md:right-[50px]">
              {showAdminButton && (
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="flex size-8 items-center justify-center rounded-full bg-card/70 text-muted-foreground hover:text-foreground"
                >
                  <LucideSettings className="size-4" />
                </button>
              )}
              {canEditCover && (
                <button
                  type="button"
                  onClick={onOpenCoverEditor}
                  className="flex size-8 items-center justify-center rounded-full bg-card/70 text-muted-foreground hover:text-foreground"
                >
                  <ImageIcon className="size-4" />
                </button>
              )}
            </div>
          )}
          {user.tournament_banners && user.tournament_banners.length > 0 && (
            <div className="absolute inset-x-4 bottom-4 flex flex-col gap-2">
              {user.tournament_banners.map(banner => (
                <Link
                  key={banner.id}
                  href={banner.link_url ?? "#"}
                  className="overflow-hidden rounded-xl border border-border/50 bg-card/70 backdrop-blur"
                >
                  <img src={banner.image_url} alt={banner.title ?? ""} className="h-14 w-full object-cover" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="relative flex h-[85px] items-end bg-secondary px-[10px] md:px-[50px]">
          <button
            type="button"
            onClick={onOpenAvatar}
            className="absolute bottom-0 left-[10px] size-[120px] shrink-0 overflow-hidden rounded-[40px] shadow-md transition-transform hover:scale-[1.02] md:left-[50px]"
            style={{ marginBottom: 0 }}
          >
            <ImageWithFallback
              src={user.avatar_url}
              alt={`${user.username}'s avatar`}
              fallBackSrc="/images/placeholder.png"
              fill
              sizes="120px"
              className="object-cover"
              fadeIn
            />
          </button>

          <div className="ml-[130px] flex min-w-0 flex-1 items-end justify-between pb-4 md:ml-[140px]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1
                  className="truncate text-[24px] font-bold text-white"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}
                >
                  {user.username}
                </h1>
                <UserPreviousUsernamesTooltip user={user} />
                <UserPrivilegeBadges badges={user.badges} small />
              </div>
              {user.title && (
                <p className="text-[16px] text-muted-foreground">
                  {user.title_url
                    ? <Link href={user.title_url} className="hover:text-primary">{user.title}</Link>
                    : user.title}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <img
                    src={`/images/flags/${user.country_code}.png`}
                    alt={user.country_code}
                    className="size-[18px] rounded-sm"
                  />
                  <CountryName countryCode={user.country_code} />
                </span>
                {user.team && (
                  <span>
                    {user.team_url
                      ? <Link href={user.team_url} className="hover:text-primary">{user.team}</Link>
                      : user.team}
                  </span>
                )}
                <UserStatusText user={user} className="text-[14px]" />
              </div>
            </div>

            <div className="mb-1 flex shrink-0 items-center gap-2">
              {!isOwnProfile && <FriendshipButton userId={user.user_id} />}
              <button
                type="button"
                onClick={toggleCoverExpanded}
                className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
              >
                {coverExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-card p-[10px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] md:px-[50px]">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-stretch xl:gap-0">
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <UserRanks userStats={userStats} />

              <div className="min-h-0 flex-1 overflow-hidden">
                <RankHistoryPreview
                  data={userGraphQuery.data}
                  currentRank={userStats?.rank ?? 0}
                />
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                {[
                  { label: "Medals", value: medalCount?.toLocaleString() ?? "—" },
                  { label: "pp", value: userStats ? Math.round(userStats.pp).toLocaleString() : "—" },
                  { label: "Play Time", value: userStats ? formatPlaytimeCompact(userStats.play_time) : "—" },
                ].map(stat => (
                  <div key={stat.label} className="flex items-center gap-1.5">
                    <span className="text-[12px] text-muted-foreground">{stat.label}</span>
                    <span className="text-[16px] font-semibold text-foreground/90">{stat.value}</span>
                  </div>
                ))}

                <div className="flex items-center gap-2">
                  {gradesData
                    ? [
                        { label: "XH", key: "count_xh" as const },
                        { label: "X", key: "count_x" as const },
                        { label: "SH", key: "count_sh" as const },
                        { label: "S", key: "count_s" as const },
                        { label: "A", key: "count_a" as const },
                      ].map(grade => (
                        <div key={grade.label} className="flex flex-col items-center">
                          <span className="text-[12px] font-bold text-primary">{grade.label}</span>
                          <span className="text-[12px] text-muted-foreground">{gradesData[grade.key].toLocaleString()}</span>
                        </div>
                      ))
                    : Array.from({ length: 5 }, (_, i) => (
                        <Skeleton key={i} className="size-8 rounded" />
                      ))}
                </div>
              </div>
            </div>

            <div className="hidden w-[2px] self-stretch bg-border xl:mx-[15px] xl:block" />
            <hr className="border-border xl:hidden" />

            <div className="shrink-0 xl:w-[260px]">
              <div className="grid grid-cols-[auto_auto] gap-x-[20px] gap-y-[4px] text-[12px]">
                {rightSideStats.map(stat => (
                  <div key={stat.label} className="contents">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span className="text-right font-semibold text-foreground">{stat.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <UserLevelProgress totalScore={userStats?.total_score ?? 0} />
              </div>
            </div>
          </div>
        </div>

        <div className="relative min-h-[50px] bg-muted p-[10px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] md:px-[50px]">
          <UserGeneralInformation
            user={user}
            metadata={metadata}
            forumPostsCount={user.forum_posts_count}
            commentsCount={user.comments_count}
          />
          {metadata && <UserSocials metadata={metadata} />}

          {isOwnProfile && (
            <button
              type="button"
              onClick={() => window.location.assign("/settings")}
              className="absolute right-2 top-2 flex size-[30px] items-center justify-center rounded-full bg-card/50 text-muted-foreground hover:text-foreground"
            >
              <Edit3Icon className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RankHistoryPreview({
  data,
  currentRank,
}: {
  data?: { snapshots: Array<{ saved_at: string; global_rank: number }> };
  currentRank: number;
}) {
  const chartData = useMemo(() => {
    if (!data?.snapshots || currentRank <= 0)
      return [];
    return data.snapshots
      .filter(snapshot => snapshot.global_rank > 0)
      .slice(-18)
      .map(snapshot => ({
        label: timeSince(snapshot.saved_at, true, true),
        rank: snapshot.global_rank,
      }));
  }, [currentRank, data?.snapshots]);

  if (currentRank <= 0 || chartData.length < 2) {
    return (
      <div className="flex h-full min-h-[90px] items-center justify-center text-sm text-muted-foreground">
        {currentRank <= 0 ? "Unranked in this ruleset." : "Not enough rank history yet."}
      </div>
    );
  }

  return (
    <div className="h-full min-h-[90px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 4, right: 0, left: -30, bottom: 0 }}>
          <CartesianGrid stroke="hsl(var(--border))" strokeOpacity={0.25} vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <YAxis
            reversed
            scale="log"
            domain={["auto", "auto"]}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={value => `#${Number(value).toLocaleString()}`}
          />
          <RechartsTooltip
            formatter={value => `#${Number(value).toLocaleString()}`}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Line type="monotone" dataKey="rank" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ModeFilters({
  activeMode,
  onModeChange,
  user,
}: {
  activeMode: GameMode;
  onModeChange: (mode: GameMode) => void;
  user: ProfileUserResponse;
}) {
  const vanilla = gameModeToVanilla(activeMode);
  const gamerule = gameModeToGamerule(activeMode);
  const modeEntries = Object.entries(GameRulesGameModes[gamerule] ?? {});
  const ruleEntries = Object.entries(GameRuleFlags[vanilla] ?? {});

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="grid gap-x-4 gap-y-2 md:grid-cols-[auto_1fr]">
        <span className="self-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">Mode</span>
        <div className="flex flex-wrap gap-1">
          {modeEntries.map(([label, mode], i) => (
            <FilterOption
              key={label}
              label={label}
              active={activeMode === mode}
              disabled={mode === null}
              onClick={() => mode != null && onModeChange(mode)}
              index={i}
              icon={mode != null ? <GameModeIcon mode={mode} /> : undefined}
            />
          ))}
        </div>
        <span className="self-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50">Ruleset</span>
        <div className="flex flex-wrap gap-1">
          {ruleEntries.map(([label, mode], i) => (
            <FilterOption
              key={label}
              label={label}
              active={mode != null && gameModeToGamerule(activeMode) === gameModeToGamerule(mode)}
              disabled={mode === null}
              onClick={() => mode != null && onModeChange(mode)}
              index={modeEntries.length + i}
            />
          ))}
        </div>
      </div>
      <SetDefaultGamemodeButton gamemode={activeMode} user={user} />
    </div>
  );
}

function formatPlaytimeCompact(playtime: number) {
  const totalSeconds = Math.floor(playtime / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0)
    parts.push(`${days}d`);
  if (hours > 0)
    parts.push(`${hours}h`);
  if (minutes > 0 || parts.length === 0)
    parts.push(`${minutes}m`);
  return parts.join(" ");
}

function CountryName({ countryCode }: { countryCode: string }) {
  const displayNamesRef = useRef<Intl.DisplayNames | null>(null);
  if (!displayNamesRef.current) {
    try {
      displayNamesRef.current = new Intl.DisplayNames(["en"], { type: "region" });
    }
    catch { /* fallback below */ }
  }
  const name = displayNamesRef.current?.of(countryCode) ?? countryCode;
  return <span className="hidden md:inline">{name}</span>;
}
