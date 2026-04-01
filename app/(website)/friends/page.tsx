"use client";
import { ChevronDown, Grid3x3, List } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { UsersList } from "@/app/(website)/friends/components/UsersList";
import { FilterOption } from "@/components/FilterOption";
import { FilterPanel } from "@/components/FilterPanel";
import { UserElementSkeleton } from "@/components/Skeletons/Users/UserElementSkeleton";
import { UserListItemSkeleton } from "@/components/Skeletons/Users/UserListItemSkeleton";
import { useFollowers } from "@/lib/hooks/api/user/useFollowers";
import { useFriends } from "@/lib/hooks/api/user/useFriends";
import { useT } from "@/lib/i18n/utils";
import type {
  FollowersResponse,
  FriendsResponse,
  UserResponse,
} from "@/lib/types/api";
import { cn } from "@/lib/utils";

type UsersType = "friends" | "followers";
type SortType = "username" | "lastActive";
type ViewMode = "grid" | "list";

export default function Friends() {
  const t = useT("pages.friends");
  const [sortBy, setSortBy] = useState<SortType>("lastActive");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  useEffect(() => {
    const value = localStorage.getItem("preferedUsersViewMode");
    if (value === "grid" || value === "list") {
      setViewMode(value);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("preferedUsersViewMode", viewMode);
  }, [viewMode]);

  const [usersType, setUsersType] = useState<UsersType>("friends");
  const isShowingFriends = usersType === "friends";

  // eslint-disable-next-line react-hooks/rules-of-hooks -- conditional hook
  const usersQuery = isShowingFriends ? useFriends(100) : useFollowers(100);
  const { data, isLoading, setSize, size } = usersQuery;

  const isLoadingMore
    = isLoading || (size > 0 && data && data[size - 1] === undefined);
  const handleShowMore = useCallback(() => {
    setSize(size + 1);
  }, [setSize, size]);

  const totalCount = data?.find(
    item => item.total_count !== undefined,
  )?.total_count;

  const sortedUsers = useMemo(() => {
    const users
      = data?.flatMap(item =>
        isShowingFriends
          ? (item as FriendsResponse).friends
          : (item as FollowersResponse).followers,
      ) ?? [];

    return [...users].sort((a, b) => {
      if (sortBy === "username") {
        return a.username.localeCompare(b.username);
      }

      const getDateSortValue = (user: UserResponse) => {
        const time = new Date(user.last_online_time).getTime();
        const isOffline = user.user_status === "Offline";

        // Offline users get a penalty in priority
        return isOffline ? time - 1e12 : time;
      };

      return getDateSortValue(b) - getDateSortValue(a);
    });
  }, [data, isShowingFriends, sortBy]);

  return (
    <div className="flex w-full flex-col space-y-2">
      <FilterPanel>
        <div className="flex items-start justify-between gap-4 px-3 py-2.5">
          <div className="grid gap-x-3 gap-y-1.5 md:grid-cols-[auto_1fr]">
            <span
              className="pt-0.5 text-[13px] font-medium text-muted-foreground"
              style={{ animation: "fade-in 300ms ease-out 200ms backwards" }}
            >
              {t("showLabel")}
            </span>
            <div className="flex flex-wrap gap-0.5">
              <FilterOption
                label={t("tabs.friends")}
                active={usersType === "friends"}
                onClick={() => setUsersType("friends")}
                index={0}
              />
              <FilterOption
                label={t("tabs.followers")}
                active={usersType === "followers"}
                onClick={() => setUsersType("followers")}
                index={1}
              />
            </div>

            <span
              className="pt-0.5 text-[13px] font-medium text-muted-foreground"
              style={{ animation: "fade-in 300ms ease-out 300ms backwards" }}
            >
              {t("sorting.label")}
            </span>
            <div className="flex flex-wrap gap-0.5">
              <FilterOption
                label={t("sorting.recentlyActive")}
                active={sortBy === "lastActive"}
                onClick={() => setSortBy("lastActive")}
                index={2}
              />
              <FilterOption
                label={t("sorting.username")}
                active={sortBy === "username"}
                onClick={() => setSortBy("username")}
                index={3}
              />
            </div>
          </div>

          <div
            className="flex shrink-0 items-center gap-0.5 border-l border-border/30 pl-3"
            style={{ animation: "fade-in 300ms ease-out 400ms backwards" }}
          >
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "rounded p-1 transition-all duration-150",
                viewMode === "list"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground/70",
              )}
            >
              <List className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded p-1 transition-all duration-150",
                viewMode === "grid"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground/70",
              )}
            >
              <Grid3x3 className="size-3.5" />
            </button>
          </div>
        </div>
      </FilterPanel>

      <div className="overflow-hidden rounded-[10px] border border-border/50 bg-card p-4 shadow-md">
        {isLoading && (!sortedUsers || sortedUsers.length === 0) ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col gap-2"
            }
          >
            {viewMode === "grid"
              ? Array.from({ length: 6 }, (_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="duration-300 animate-in fade-in"
                    style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
                  >
                    <UserElementSkeleton />
                  </div>
                ))
              : Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="duration-300 animate-in fade-in"
                    style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
                  >
                    <UserListItemSkeleton />
                  </div>
                ))}
          </div>
        ) : (
          <>
            <UsersList users={sortedUsers ?? []} viewMode={viewMode} />

            {(sortedUsers?.length ?? 0) < (totalCount ?? 0) && (
              <div className="mt-4 flex justify-center">
                <button
                  type="button"
                  onClick={handleShowMore}
                  disabled={isLoadingMore}
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                >
                  <ChevronDown className="size-4" />
                  {t("showMore")}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
