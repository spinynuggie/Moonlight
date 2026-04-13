import type { ProfileSectionId } from "@/lib/hooks/api/user/useUserProfile";
import { GameMode } from "@/lib/types/api";
import { gameModeToVanilla } from "@/lib/utils/gameMode.util";

export const PROFILE_MODE_SEGMENT_TO_MODE = {
  taiko: GameMode.TAIKO,
  fruits: GameMode.CATCH_THE_BEAT,
  mania: GameMode.MANIA,
} as const;

export type ProfileModeSegment = keyof typeof PROFILE_MODE_SEGMENT_TO_MODE;

export const PROFILE_SECTION_LABELS: Record<ProfileSectionId, string> = {
  me: "me!",
  recent_activity: "Recent",
  top_ranks: "Ranks",
  medals: "Medals",
  historical: "Historical",
  beatmaps: "Beatmaps",
  account_standing: "Standing",
};

export const LEGACY_PROFILE_TAB_MAP: Record<string, ProfileSectionId> = {
  general: "me",
  scores: "top_ranks",
  bestScores: "top_ranks",
  recentScores: "historical",
  firstPlaces: "top_ranks",
  beatmaps: "beatmaps",
  medals: "medals",
};

export function isProfileModeSegment(value: string): value is ProfileModeSegment {
  return value in PROFILE_MODE_SEGMENT_TO_MODE;
}

export function parseProfileModeCandidate(candidate?: string | null) {
  if (!candidate)
    return null;

  const normalized = candidate.trim().toLowerCase();

  if (isProfileModeSegment(normalized)) {
    return PROFILE_MODE_SEGMENT_TO_MODE[normalized];
  }

  switch (normalized) {
    case "osu":
    case "osu!":
    case "standard":
      return GameMode.STANDARD;
    case "taiko":
      return GameMode.TAIKO;
    case "catch":
    case "catchthebeat":
    case "ctb":
    case "fruits":
      return GameMode.CATCH_THE_BEAT;
    case "mania":
      return GameMode.MANIA;
    default:
      break;
  }

  if (Object.values(GameMode).includes(candidate as GameMode)) {
    return gameModeToVanilla(candidate as GameMode);
  }

  return null;
}

export function modeToProfileSegment(mode: GameMode) {
  switch (gameModeToVanilla(mode)) {
    case GameMode.TAIKO:
      return "taiko";
    case GameMode.CATCH_THE_BEAT:
      return "fruits";
    case GameMode.MANIA:
      return "mania";
    default:
      return null;
  }
}

export function buildProfilePath(
  userId: number,
  mode: GameMode,
  defaultMode: GameMode,
) {
  const segment = modeToProfileSegment(mode);
  const defaultSegment = modeToProfileSegment(defaultMode);

  if (segment === defaultSegment)
    return `/user/${userId}`;

  if (!segment)
    return `/user/${userId}`;

  return `/user/${userId}/${segment}`;
}
