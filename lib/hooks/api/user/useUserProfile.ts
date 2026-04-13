"use client";

import type { HTTPError } from "ky";
import useSWRInfinite from "swr/infinite";
import useSWRMutation from "swr/mutation";

import fetcher from "@/lib/services/fetcher";
import poster from "@/lib/services/poster";
import type {
  BeatmapSetResponse,
  GameMode,
  UserResponse,
} from "@/lib/types/api";

export type ProfileSectionId
  = | "me"
    | "recent_activity"
    | "top_ranks"
    | "medals"
    | "historical"
    | "beatmaps"
    | "account_standing";

export const DEFAULT_PROFILE_SECTION_ORDER: ProfileSectionId[] = [
  "me",
  "recent_activity",
  "top_ranks",
  "medals",
  "historical",
  "beatmaps",
  "account_standing",
];

export type ProfileTournamentBanner = {
  id: string | number;
  image_url: string;
  link_url?: string | null;
  title?: string | null;
};

export type ProfileUserResponse = UserResponse & {
  profile_order?: ProfileSectionId[] | null;
  title?: string | null;
  title_url?: string | null;
  team?: string | null;
  team_url?: string | null;
  can_edit_profile?: boolean | null;
  can_edit_cover?: boolean | null;
  comments_count?: number | null;
  forum_posts_count?: number | null;
  replay_watch_count?: number | null;
  tournament_banners?: ProfileTournamentBanner[] | null;
};

export type ProfileActivityItem = {
  id: number | string;
  type: string;
  created_at: string;
  message?: string | null;
  title?: string | null;
  url?: string | null;
  beatmap_id?: number | null;
  beatmapset_id?: number | null;
  beatmap_title?: string | null;
  beatmap_version?: string | null;
  medal_id?: number | null;
  medal_name?: string | null;
  grade?: string | null;
  amount?: number | null;
  icon_text?: string | null;
  actor?: UserResponse | null;
};

export type ProfileActivityResponse = {
  events: ProfileActivityItem[];
  total_count: number;
};

export type UserBeatmapSetCollectionType
  = | "favourite"
    | "ranked"
    | "loved"
    | "guest"
    | "pending"
    | "graveyard"
    | "nominated";

export type UserBeatmapSetCollectionResponse = {
  sets: BeatmapSetResponse[];
  total_count: number;
};

function isHttpErrorWithStatus(error: unknown, status: number) {
  const httpError = error as HTTPError | undefined;
  return httpError?.response?.status === status;
}

async function optionalFetch<T>(url: string, fallback: T) {
  try {
    return await fetcher<T>(url);
  }
  catch (error) {
    if (
      isHttpErrorWithStatus(error, 400)
      || isHttpErrorWithStatus(error, 401)
      || isHttpErrorWithStatus(error, 404)
    ) {
      return fallback;
    }

    throw error;
  }
}

export function useUserProfileActivity(
  userId: number,
  limit = 5,
) {
  const getKey = (
    pageIndex: number,
    previousPageData?: ProfileActivityResponse,
  ) => {
    if (previousPageData && previousPageData.events.length === 0)
      return null;

    const queryParams = new URLSearchParams({
      page: (pageIndex + 1).toString(),
      limit: limit.toString(),
    });

    return `user/${userId}/activity?${queryParams.toString()}`;
  };

  return useSWRInfinite<ProfileActivityResponse>(
    getKey,
    url => optionalFetch(url, { events: [], total_count: 0 }),
  );
}

export function useUserBeatmapSets(
  userId: number,
  mode: GameMode,
  type: UserBeatmapSetCollectionType,
  limit = 6,
) {
  const getKey = (
    pageIndex: number,
    previousPageData?: UserBeatmapSetCollectionResponse,
  ) => {
    if (previousPageData && previousPageData.sets.length === 0)
      return null;

    const queryParams = new URLSearchParams({
      mode: mode.toString(),
      type,
      page: (pageIndex + 1).toString(),
      limit: limit.toString(),
    });

    return `user/${userId}/beatmapsets?${queryParams.toString()}`;
  };

  return useSWRInfinite<UserBeatmapSetCollectionResponse>(
    getKey,
    url => optionalFetch(url, { sets: [], total_count: 0 }),
  );
}

export function useReorderProfileSections() {
  return useSWRMutation(
    "user/edit/profile-order",
    async (
      _url: string,
      { arg }: { arg: { profile_order: ProfileSectionId[] } },
    ) => {
      return await poster("user/edit/profile-order", {
        json: arg,
      });
    },
  );
}
