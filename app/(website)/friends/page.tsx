"use client";
import { motion } from "framer-motion";
import { ChevronDown, Users2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { UsersList } from "@/app/(website)/friends/components/UsersList";
import type {
  UsersListSortingType,
} from "@/app/(website)/friends/components/UsersListSortingOptions";
import {
  UsersListSortingOptions,
} from "@/app/(website)/friends/components/UsersListSortingOptions";
import type {
  UsersListViewModeType,
} from "@/app/(website)/friends/components/UsersListViewModeOptions";
import {
  UsersListViewModeOptions,
} from "@/app/(website)/friends/components/UsersListViewModeOptions";
import { UserElementSkeleton } from "@/components/Skeletons/Users/UserElementSkeleton";
import { UserListItemSkeleton } from "@/components/Skeletons/Users/UserListItemSkeleton";
import { Button } from "@/components/ui/button";
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

export default function Friends() {
  const t = useT("pages.friends");
  const [sortBy, setSortBy] = useState<UsersListSortingType>("lastActive");
  const [viewMode, setViewMode] = useState<UsersListViewModeType>("grid");

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
    <div className="flex w-full flex-col space-y-3">
      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-2 rounded-[10px] border border-border/50 bg-card p-4 shadow-md"
      >
        <span className="text-muted-foreground">
          <Users2 className="size-5" />
        </span>
        <h1 className="text-lg font-semibold">{t("header")}</h1>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
        className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-border/50 bg-card px-4 py-3 shadow-md"
      >
        <div className="flex gap-1.5">
          <Button
            size="sm"
            onClick={() => setUsersType("friends")}
            variant={usersType === "friends" ? "default" : "secondary"}
            className={cn(usersType === "friends" && "text-black")}
          >
            {t("tabs.friends")}
          </Button>
          <Button
            size="sm"
            onClick={() => setUsersType("followers")}
            variant={usersType === "followers" ? "default" : "secondary"}
            className={cn(usersType === "followers" && "text-black")}
          >
            {t("tabs.followers")}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <UsersListSortingOptions
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          <UsersListViewModeOptions
            viewMode={viewMode}
            onViewChange={setViewMode}
          />
        </div>
      </motion.div>

      {/* Users List */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        className="overflow-hidden rounded-[10px] border border-border/50 bg-card p-4 shadow-md"
      >
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
      </motion.div>
    </div>
  );
}
