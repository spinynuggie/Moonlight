"use client";

import { Edit3, ImageIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import UploadImageForm from "@/app/(website)/settings/components/UploadImageForm";
import {
  buildProfilePath,
  LEGACY_PROFILE_TAB_MAP,
  parseProfileModeCandidate,
  PROFILE_SECTION_LABELS,
} from "@/app/(website)/user/[id]/components/profile/profileRouting";
import { ProfileSectionCard } from "@/app/(website)/user/[id]/components/profile/ProfileSectionCard";
import { ProfileStickyTabs } from "@/app/(website)/user/[id]/components/profile/ProfileStickyTabs";
import { ProfileSummary } from "@/app/(website)/user/[id]/components/profile/ProfileSummary";
import { ProfileAccountStandingSection } from "@/app/(website)/user/[id]/components/profile/sections/ProfileAccountStandingSection";
import { ProfileBeatmapsSection } from "@/app/(website)/user/[id]/components/profile/sections/ProfileBeatmapsSection";
import { ProfileHistoricalSection } from "@/app/(website)/user/[id]/components/profile/sections/ProfileHistoricalSection";
import { ProfileMedalsSection } from "@/app/(website)/user/[id]/components/profile/sections/ProfileMedalsSection";
import { ProfileMeSection } from "@/app/(website)/user/[id]/components/profile/sections/ProfileMeSection";
import { ProfileRecentActivitySection } from "@/app/(website)/user/[id]/components/profile/sections/ProfileRecentActivitySection";
import { ProfileTopRanksSection } from "@/app/(website)/user/[id]/components/profile/sections/ProfileTopRanksSection";
import { UserProfileSkeleton } from "@/components/Skeletons/Users/UserProfileSkeleton";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useUser,
  useUserSelf,
  useUserStats,
} from "@/lib/hooks/api/user/useUser";
import { useUserMetadata } from "@/lib/hooks/api/user/useUserMetadata";
import type { ProfileSectionId, ProfileUserResponse } from "@/lib/hooks/api/user/useUserProfile";
import {
  DEFAULT_PROFILE_SECTION_ORDER,
} from "@/lib/hooks/api/user/useUserProfile";
import useSelf from "@/lib/hooks/useSelf";
import { GameMode } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { gameModeToVanilla } from "@/lib/utils/gameMode.util";
import { isUserHasAdminPrivilege } from "@/lib/utils/userPrivileges.util";

const NON_LAZY_SECTIONS = new Set<ProfileSectionId>([
  "me",
  "medals",
  "account_standing",
]);

const SECTION_PLACEHOLDER_HEIGHT: Record<ProfileSectionId, number> = {
  me: 280,
  recent_activity: 280,
  top_ranks: 520,
  medals: 520,
  historical: 680,
  beatmaps: 560,
  account_standing: 220,
};

interface ProfilePageClientProps {
  userId: number;
  routeMode?: string | null;
  legacyMode?: string | null;
  legacyTab?: string | null;
}

export default function ProfilePageClient({
  userId,
  routeMode,
  legacyMode,
  legacyTab,
}: ProfilePageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { self } = useSelf();

  const selfUserQuery = useUserSelf();
  const userQuery = useUser(userId);

  const isOwnProfile = self?.user_id === userId;
  const user = (isOwnProfile
    ? (selfUserQuery.data ?? userQuery.data)
    : userQuery.data) as ProfileUserResponse | undefined;

  const [activeMode, setActiveMode] = useState<GameMode | null>(() => {
    return parseProfileModeCandidate(routeMode ?? legacyMode);
  });

  const effectiveDefaultMode = user
    ? gameModeToVanilla(user.default_gamemode)
    : GameMode.STANDARD;

  useEffect(() => {
    if (!user)
      return;

    const requestedMode = parseProfileModeCandidate(routeMode ?? legacyMode);
    const nextMode = requestedMode ?? effectiveDefaultMode;

    setActiveMode(current => current ?? nextMode);
  }, [effectiveDefaultMode, legacyMode, routeMode, user]);

  const userStatsQuery = useUserStats(userId, activeMode);
  const userMetadataQuery = useUserMetadata(userId);

  const userStats = userStatsQuery.data?.stats;
  const metadata = userMetadataQuery.data;

  const canEditProfile = Boolean(
    user && (isOwnProfile || (self && isUserHasAdminPrivilege(self))),
  );

  const sectionVisibility = useMemo(() => {
    return {
      me: Boolean((user?.description && user.description.trim().length > 0) || isOwnProfile || (self && isUserHasAdminPrivilege(self))),
      recent_activity: true,
      top_ranks: true,
      medals: true,
      historical: true,
      beatmaps: true,
      account_standing: Boolean(user?.restricted || user?.silenced_until),
    } as const;
  }, [canEditProfile, isOwnProfile, self, user?.description, user?.restricted, user?.silenced_until]);

  const computedSectionOrder = useMemo(() => {
    const availableSections = DEFAULT_PROFILE_SECTION_ORDER.filter(sectionId => sectionVisibility[sectionId]);
    const customOrder = user?.profile_order ?? [];
    const seen = new Set<ProfileSectionId>();
    const nextOrder: ProfileSectionId[] = [];

    for (const sectionId of customOrder) {
      if (!availableSections.includes(sectionId) || seen.has(sectionId))
        continue;

      seen.add(sectionId);
      nextOrder.push(sectionId);
    }

    for (const sectionId of availableSections) {
      if (seen.has(sectionId))
        continue;

      nextOrder.push(sectionId);
    }

    return nextOrder;
  }, [sectionVisibility, user?.profile_order]);

  const [sectionOrder, setSectionOrder] = useState<ProfileSectionId[]>(() => computedSectionOrder);
  const [loadedSections, setLoadedSections] = useState<Set<ProfileSectionId>>(() => {
    return new Set(DEFAULT_PROFILE_SECTION_ORDER.filter(sectionId => NON_LAZY_SECTIONS.has(sectionId)));
  });
  const [activeSection, setActiveSection] = useState<ProfileSectionId>(() => {
    return LEGACY_PROFILE_TAB_MAP[legacyTab ?? ""] ?? "me";
  });
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [coverEditorOpen, setCoverEditorOpen] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(() => !user || !activeMode);
  const [isCrossfading, setIsCrossfading] = useState(false);
  const dataReadyRef = useRef(Boolean(user && activeMode));

  const sectionElementsRef = useRef<Partial<Record<ProfileSectionId, HTMLElement | null>>>({});
  const stickyTabsRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(76);
  const initialHashScrolledRef = useRef(false);
  const programmaticTargetRef = useRef<ProfileSectionId | null>(null);
  const programmaticTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const stickySentinelRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    setSectionOrder(computedSectionOrder);
  }, [computedSectionOrder]);

  useEffect(() => {
    const measureHeader = () => {
      const header = document.querySelector("header.sticky");
      setHeaderHeight(header instanceof HTMLElement ? header.offsetHeight : 76);
    };

    measureHeader();
    window.addEventListener("resize", measureHeader);
    return () => window.removeEventListener("resize", measureHeader);
  }, []);

  useEffect(() => {
    if (!user || !activeMode)
      return;

    const targetPath = buildProfilePath(user.user_id, activeMode, effectiveDefaultMode);
    const hashFromLocation = typeof window !== "undefined"
      ? window.location.hash.replace("#", "")
      : "";
    const targetSection = LEGACY_PROFILE_TAB_MAP[legacyTab ?? ""] ?? hashFromLocation;
    const targetHash = sectionOrder.includes(targetSection as ProfileSectionId)
      ? `#${targetSection}`
      : "";
    const hasLegacyParams = Boolean(legacyMode || legacyTab || searchParams.get("mode") || searchParams.get("tab"));

    if (pathname !== targetPath || hasLegacyParams) {
      router.replace(`${targetPath}${targetHash}`, { scroll: false });
    }
  }, [
    activeMode,
    effectiveDefaultMode,
    legacyMode,
    legacyTab,
    pathname,
    router,
    searchParams,
    sectionOrder,
    user,
  ]);

  const stickyOffset = headerHeight + 12;

  const scrollToSection = useCallback((sectionId: ProfileSectionId, behavior: ScrollBehavior) => {
    const section = sectionElementsRef.current[sectionId];

    if (!section)
      return;

    const tabsHeight = stickyTabsRef.current?.offsetHeight ?? 0;
    const targetTop = window.scrollY + section.getBoundingClientRect().top - headerHeight - tabsHeight - 20;

    window.history.replaceState(null, "", `${buildProfilePath(userId, activeMode ?? effectiveDefaultMode, effectiveDefaultMode)}#${sectionId}`);
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior,
    });
  }, [activeMode, effectiveDefaultMode, headerHeight, userId]);

  useEffect(() => {
    if (!user || !sectionOrder.length || initialHashScrolledRef.current)
      return;

    const hash = window.location.hash.replace("#", "");

    if (!hash || !sectionOrder.includes(hash as ProfileSectionId))
      return;

    initialHashScrolledRef.current = true;
    requestAnimationFrame(() => scrollToSection(hash as ProfileSectionId, "auto"));
  }, [scrollToSection, sectionOrder, user]);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionOrder.length)
        return;

      if (programmaticTargetRef.current) {
        return;
      }

      const tabsHeight = stickyTabsRef.current?.offsetHeight ?? 0;
      const offset = headerHeight + tabsHeight + 24;
      const bottomReached = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

      if (bottomReached) {
        setActiveSection(sectionOrder.at(-1) ?? sectionOrder[0]);
        return;
      }

      let nextActive = sectionOrder[0];

      for (const sectionId of sectionOrder) {
        const node = sectionElementsRef.current[sectionId];

        if (!node)
          continue;

        const top = node.getBoundingClientRect().top - offset;
        if (top <= 0) {
          nextActive = sectionId;
        }
        else {
          break;
        }
      }

      setActiveSection(nextActive);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      clearTimeout(programmaticTimerRef.current);
    };
  }, [headerHeight, sectionOrder]);

  useEffect(() => {
    const sentinel = stickySentinelRef.current;
    if (!sentinel)
      return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsSticky(!entry.isIntersecting),
      { rootMargin: `-${stickyOffset}px 0px 0px 0px` },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [stickyOffset]);

  const handleTabSelect = useCallback((sectionId: ProfileSectionId) => {
    clearTimeout(programmaticTimerRef.current);
    programmaticTargetRef.current = sectionId;
    setActiveSection(sectionId);
    scrollToSection(sectionId, "smooth");
    programmaticTimerRef.current = setTimeout(() => {
      programmaticTargetRef.current = null;
    }, 800);
  }, [scrollToSection]);

  useEffect(() => {
    if (user && activeMode && !dataReadyRef.current) {
      dataReadyRef.current = true;
      setIsCrossfading(true);
      const timer = setTimeout(() => {
        setShowSkeleton(false);
        setIsCrossfading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [user, activeMode]);

  const markSectionVisible = useCallback((sectionId: ProfileSectionId) => {
    const previousTop = sectionElementsRef.current[sectionId]?.getBoundingClientRect().top ?? null;

    setLoadedSections((current) => {
      if (current.has(sectionId))
        return current;

      const next = new Set(current);
      next.add(sectionId);
      return next;
    });

    requestAnimationFrame(() => {
      if (previousTop == null || programmaticTargetRef.current)
        return;

      const nextTop = sectionElementsRef.current[sectionId]?.getBoundingClientRect().top ?? previousTop;
      const delta = nextTop - previousTop;

      if (Math.abs(delta) > 1 && previousTop < window.innerHeight) {
        window.scrollBy({ top: delta });
      }
    });
  }, []);

  if (userQuery.error && !user) {
    return (
      <div className="rounded-[16px] border border-border/50 bg-card px-6 py-10 text-center text-sm text-muted-foreground shadow-md">
        {userQuery.error.message}
      </div>
    );
  }

  const sectionTabs = sectionOrder.map(sectionId => ({
    id: sectionId,
    label: PROFILE_SECTION_LABELS[sectionId],
  }));

  return (
    <div className="relative">
      {user && (
        <link rel="preload" as="image" href={`/_next/image?url=${encodeURIComponent(`${user.banner_url}&default=false`)}&w=1080&q=90`} />
      )}
      {showSkeleton && (
        <div
          className={cn(
            isCrossfading
            && "profile-crossfade-out pointer-events-none absolute inset-x-0 top-0 z-10",
          )}
        >
          <UserProfileSkeleton />
        </div>
      )}
      {user && activeMode && (
        <div className={cn("space-y-3", isCrossfading && "profile-crossfade-in")}>
          <ProfileSummary
            user={user}
            userStats={userStats}
            metadata={metadata}
            activeMode={activeMode}
            onModeSelect={setActiveMode}
            onOpenAvatar={() => setAvatarOpen(true)}
            onOpenCoverEditor={() => setCoverEditorOpen(true)}
            onOpenAdmin={() => router.push(`/admin/users/${user.user_id}/edit`)}
            self={self}
          />

          <div className="mx-auto w-full max-w-[1000px] space-y-3">
            <div ref={stickySentinelRef} className="h-0" aria-hidden="true" />
            <ProfileStickyTabs
              sections={sectionTabs}
              activeSection={activeSection}
              topOffset={stickyOffset}
              containerRef={stickyTabsRef}
              onSelect={handleTabSelect}
              isSticky={isSticky}
            />

            <div className="space-y-4">
              {sectionOrder.map((sectionId) => {
                const isLazy = !NON_LAZY_SECTIONS.has(sectionId);
                const loaded = loadedSections.has(sectionId);

                return (
                  <ProfileSectionCard
                    key={sectionId}
                    sectionId={sectionId}
                    title={PROFILE_SECTION_LABELS[sectionId]}
                    sectionRef={(node) => {
                      sectionElementsRef.current[sectionId] = node;
                    }}
                    lazy={isLazy}
                    loaded={loaded}
                    onVisible={markSectionVisible}
                    placeholder={<SectionPlaceholder height={SECTION_PLACEHOLDER_HEIGHT[sectionId]} />}
                  >
                    {renderSection(sectionId, {
                      user,
                      userId,
                      activeMode,
                    })}
                  </ProfileSectionCard>
                );
              })}
            </div>
          </div>

          <Dialog open={avatarOpen} onOpenChange={setAvatarOpen}>
            <DialogContent className="border-none bg-transparent p-0 shadow-none sm:max-w-sm">
              <DialogTitle className="sr-only">{user.username}&apos;s avatar</DialogTitle>
              <div className="relative aspect-square w-full overflow-hidden rounded-full">
                <Image
                  src={user.avatar_url}
                  alt={`${user.username}'s avatar`}
                  fill
                  sizes="(min-width: 640px) 384px, 90vw"
                  className="object-cover"
                />
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={coverEditorOpen} onOpenChange={setCoverEditorOpen}>
            <DialogContent className="max-w-4xl">
              <DialogTitle>Profile Media</DialogTitle>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="size-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Banner</h3>
                  </div>
                  <UploadImageForm type="banner" hideNote />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Edit3 className="size-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Avatar</h3>
                  </div>
                  <UploadImageForm type="avatar" hideNote />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}

function renderSection(
  sectionId: ProfileSectionId,
  {
    user,
    userId,
    activeMode,
  }: {
    user: ProfileUserResponse;
    userId: number;
    activeMode: GameMode;
  },
) {
  switch (sectionId) {
    case "me":
      return <ProfileMeSection user={user} />;
    case "recent_activity":
      return <ProfileRecentActivitySection userId={userId} />;
    case "top_ranks":
      return <ProfileTopRanksSection userId={userId} gameMode={activeMode} />;
    case "medals":
      return <ProfileMedalsSection userId={userId} gameMode={activeMode} />;
    case "historical":
      return <ProfileHistoricalSection userId={userId} gameMode={activeMode} />;
    case "beatmaps":
      return <ProfileBeatmapsSection userId={userId} gameMode={activeMode} />;
    case "account_standing":
      return <ProfileAccountStandingSection user={user} />;
    default:
      return null;
  }
}

function SectionPlaceholder({ height }: { height: number }) {
  return (
    <div className="space-y-3" style={{ minHeight: height }}>
      <Skeleton className="h-8 w-44 rounded-full" />
      <Skeleton className="h-24 rounded-[14px]" />
      <Skeleton className="h-24 rounded-[14px]" />
      <Skeleton className="h-24 rounded-[14px]" />
    </div>
  );
}
