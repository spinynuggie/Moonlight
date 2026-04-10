"use client";

import {
  BookCopy,
  ChartColumnIncreasing,
  Clock,
  Cog,
  LucideHistory,
  Music,
  Search,
  Trash2,
  UserIcon,
  Users2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import BeatmapStatusIcon from "@/components/BeatmapStatus";
import ImageWithFallback from "@/components/ImageWithFallback";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useBeatmapsetSearch } from "@/lib/hooks/api/beatmap/useBeatmapsetSearch";
import { useUserSearch } from "@/lib/hooks/api/user/useUserSearch";
import useDebounce from "@/lib/hooks/useDebounce";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import { BeatmapStatusWeb, GameMode } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const RECENT_SEARCHES_KEY = "moonlight-recent-searches";
const MAX_RECENT_SEARCHES = 5;

type SearchTab = "all" | "users" | "beatmaps" | "pages";

function getRecentSearches(): string[] {
  if (typeof window === "undefined")
    return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  catch {
    return [];
  }
}

function addRecentSearch(query: string) {
  const trimmed = query.trim();
  if (!trimmed)
    return;
  const searches = getRecentSearches().filter(s => s !== trimmed);
  searches.unshift(trimmed);
  localStorage.setItem(
    RECENT_SEARCHES_KEY,
    JSON.stringify(searches.slice(0, MAX_RECENT_SEARCHES)),
  );
}

function removeRecentSearch(query: string) {
  const searches = getRecentSearches().filter(s => s !== query);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
}

function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

export default function HeaderSearchCommand() {
  const t = useT("components.headerSearchCommand");
  const router = useRouter();
  const { self } = useSelf();

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchValue = useDebounce<string>(searchQuery, 450);

  const tabRefs = useRef<Map<SearchTab, HTMLButtonElement>>(new Map());
  const tabNavRef = useRef<HTMLDivElement>(null);
  const [tabHighlight, setTabHighlight] = useState({ left: 0, width: 0, ready: false });

  const pagesList = useMemo(
    () => [
      {
        icon: <ChartColumnIncreasing className="size-4" />,
        title: t("pages.leaderboard"),
        url: "/leaderboard",
        filter: "Leaderboard",
      },
      {
        icon: <LucideHistory className="size-4" />,
        title: t("pages.topPlays"),
        url: "/topplays",
        filter: "Top plays",
      },
      {
        icon: <Search className="size-4" />,
        title: t("pages.beatmapsSearch"),
        url: "/beatmaps/search",
        filter: "Beatmaps search",
      },
      {
        icon: <BookCopy className="size-4" />,
        title: t("pages.wiki"),
        url: "/wiki",
        filter: "Wiki",
      },
      {
        icon: <BookCopy className="size-4" />,
        title: t("pages.rules"),
        url: "/rules",
        filter: "Rules",
      },
      {
        icon: <UserIcon className="size-4" />,
        title: t("pages.yourProfile"),
        url: self !== undefined ? `/user/${self.user_id}` : "",
        filter: "Your profile",
        disabled: !self,
      },
      {
        icon: <Users2 className="size-4" />,
        title: t("pages.friends"),
        url: "/friends",
        filter: "Friends",
        disabled: !self,
      },
      {
        icon: <Cog className="size-4" />,
        title: t("pages.settings"),
        url: "/settings",
        filter: "Settings",
        disabled: !self,
      },
    ],
    [t, self],
  );

  const userSearchQuery = useUserSearch(searchValue, 1, 5, {
    keepPreviousData: true,
  });

  const beatmapsetSearchQuery = useBeatmapsetSearch(
    searchValue,
    searchValue === "" ? 0 : 5,
    [
      BeatmapStatusWeb.APPROVED,
      BeatmapStatusWeb.LOVED,
      BeatmapStatusWeb.QUALIFIED,
      BeatmapStatusWeb.RANKED,
    ],
    GameMode.STANDARD,
    undefined,
    {
      refreshInterval: 0,
    },
  );

  const userSearch = userSearchQuery.data;
  const beatmapsetSearch = beatmapsetSearchQuery.data?.flatMap(d => d.sets);

  const filteredPages = useMemo(() => {
    const available = pagesList.filter(p => !p.disabled);
    if (searchQuery === "")
      return available;
    return available.filter(p =>
      p.filter.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, pagesList]);

  const userCount = searchValue !== "" && userSearch ? userSearch.length : undefined;
  const beatmapCount = searchValue !== "" && beatmapsetSearch ? beatmapsetSearch.length : undefined;

  const showUserResults = (activeTab === "all" || activeTab === "users") && searchQuery !== "";
  const showBeatmapResults = (activeTab === "all" || activeTab === "beatmaps") && searchQuery !== "";
  const showPages = activeTab === "all" || activeTab === "pages";
  const showRecent = searchQuery === "" && recentSearches.length > 0 && activeTab === "all";

  const tabs: Array<{ id: SearchTab; label: string; count?: number }> = useMemo(
    () => [
      { id: "all", label: t("tabs.all") },
      { id: "users", label: t("tabs.users"), count: userCount },
      { id: "beatmaps", label: t("tabs.beatmaps"), count: beatmapCount },
      { id: "pages", label: t("tabs.pages") },
    ],
    [t, userCount, beatmapCount],
  );

  const updateTabHighlight = useCallback(() => {
    const nav = tabNavRef.current;
    const tab = tabRefs.current.get(activeTab);
    if (!nav || !tab)
      return;

    setTabHighlight({ left: tab.offsetLeft, width: tab.offsetWidth, ready: true });
  }, [activeTab]);

  useLayoutEffect(() => {
    updateTabHighlight();
  }, [updateTabHighlight]);

  useEffect(() => {
    const nav = tabNavRef.current;
    if (!nav)
      return;

    const observer = new ResizeObserver(() => updateTabHighlight());
    observer.observe(nav);
    return () => observer.disconnect();
  }, [updateTabHighlight]);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => setSearchQuery(""), 200);
      return () => clearTimeout(timer);
    }
    setRecentSearches(getRecentSearches());
    setActiveTab("all");
    setTabHighlight(prev => ({ ...prev, ready: false }));
  }, [open]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const openPage = useCallback(
    (url: string) => {
      if (searchQuery.trim())
        addRecentSearch(searchQuery);
      setOpen(false);
      setTimeout(() => router.push(url), 100);
    },
    [searchQuery, router],
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="smooth-transition size-7 cursor-pointer rounded-md p-1 opacity-40 hover:bg-accent group-hover:opacity-100 group-data-[scrolled]:opacity-100"
      >
        <Search className="size-full" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={cn(
            "max-w-screen-sm gap-0 overflow-hidden rounded-[20px] border border-border/50 p-0",
            "bg-background/30 shadow-2xl shadow-black/40 backdrop-blur-2xl",
            "[&>button:last-child]:hidden",
          )}
        >
          <DialogTitle className="sr-only">Search</DialogTitle>

          <Command
            shouldFilter={false}
            className={cn(
              "shadow-[0_1px_0_0_rgba(255,255,255,0.05)] [&_[cmdk-input-wrapper]]:h-14 [&_[cmdk-input-wrapper]]:border-none [&_[cmdk-input-wrapper]]:bg-black/20 [&_[cmdk-input-wrapper]]:px-4",
              "[&_[cmdk-input-wrapper]_svg]:!size-[18px] [&_[cmdk-input-wrapper]_svg]:text-muted-foreground/50",
              "[&_[cmdk-input]]:h-14 [&_[cmdk-input]]:text-[15px]",
              "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground/50",
              "[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2",
              "[&_[cmdk-item]]:gap-3 [&_[cmdk-item]]:rounded-[10px] [&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-2.5",
              "[&_[cmdk-item][data-selected=true]]:bg-primary/[0.08]",
            )}
          >
            <CommandInput
              value={searchQuery}
              onValueChange={setSearchQuery}
              placeholder={t("placeholder")}
            />

            <div className="border-b border-white/5 px-3 pb-2">
              <div ref={tabNavRef} className="relative flex">
                <span
                  className={cn(
                    "pointer-events-none absolute inset-y-0 rounded-lg bg-primary/[0.08] transition-[left,width] duration-300 ease-in-out",
                    !tabHighlight.ready && "opacity-0",
                  )}
                  style={{
                    left: tabHighlight.left,
                    width: tabHighlight.width,
                  }}
                />
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      if (el)
                        tabRefs.current.set(tab.id, el);
                      else tabRefs.current.delete(tab.id);
                    }}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "relative flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-300",
                      activeTab === tab.id
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="whitespace-nowrap">{tab.label}</span>
                    {tab.count !== undefined && tab.count > 0 && (
                      <span
                        className={cn(
                          "min-w-[18px] rounded-full px-1 py-0.5 text-center text-[10px] font-semibold leading-none transition-colors duration-300",
                          activeTab === tab.id
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-muted-foreground/70",
                        )}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <CommandList className="max-h-[400px]">
              {showRecent && (
                <CommandGroup heading={t("headings.recent")}>
                  {recentSearches.map(search => (
                    <CommandItem
                      key={`recent-${search}`}
                      onSelect={() => setSearchQuery(search)}
                      className="group/recent"
                    >
                      <Clock className="!size-4 !text-muted-foreground/40" />
                      <span className="flex-grow truncate text-muted-foreground">{search}</span>
                      <button
                        className="flex-shrink-0 rounded p-0.5 text-muted-foreground/30 opacity-0 transition-all hover:text-foreground group-data-[selected=true]/recent:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeRecentSearch(search);
                          setRecentSearches(prev => prev.filter(s => s !== search));
                        }}
                      >
                        <X className="!size-3" />
                      </button>
                    </CommandItem>
                  ))}
                  <CommandItem
                    onSelect={() => {
                      clearRecentSearches();
                      setRecentSearches([]);
                    }}
                  >
                    <Trash2 className="!size-4 !text-muted-foreground/30" />
                    <span className="text-xs text-muted-foreground/50">{t("clearRecent")}</span>
                  </CommandItem>
                </CommandGroup>
              )}

              {showUserResults && (
                <CommandGroup
                  heading={t("headings.users")}
                  className={cn(
                    "transition-opacity duration-200",
                    userSearchQuery.isValidating && userSearch && userSearch.length > 0 && "opacity-50",
                  )}
                >
                  {userSearchQuery.isLoading && !userSearch
                    ? (
                        Array.from({ length: 3 }, (_, i) => (
                          <CommandItem key={`user-skeleton-${i}`} disabled className="pointer-events-none">
                            <div className="flex w-full items-center gap-3">
                              <Skeleton className="size-8 shrink-0 rounded-full" />
                              <div className="flex-1 space-y-1">
                                <Skeleton className="h-3.5 w-24 rounded" />
                              </div>
                            </div>
                          </CommandItem>
                        ))
                      )
                    : (
                        <>
                          {userSearch?.map((result, i) => (
                            <CommandItem
                              key={`user-${result.user_id}`}
                              onSelect={() => openPage(`/user/${result.user_id}`)}
                              style={{ animation: `profile-item-slide-in 300ms ease-out ${i * 50}ms backwards` }}
                            >
                              <Image
                                src={result.avatar_url}
                                alt=""
                                width={32}
                                height={32}
                                className="size-8 rounded-full object-cover shadow-sm ring-1 ring-white/10 duration-500 animate-in fade-in fill-mode-both"
                              />
                              <div className="flex min-w-0 items-center gap-2">
                                <img
                                  src={`/images/flags/${result.country_code}.png`}
                                  alt=""
                                  className="size-4 shrink-0"
                                />
                                <span className="truncate font-medium">{result.username}</span>
                              </div>
                            </CommandItem>
                          ))}
                          {userSearch && userSearch.length === 0 && !userSearchQuery.isValidating && (
                            <div className="py-6 text-center text-sm text-muted-foreground/50">
                              {t("noUsersFound")}
                            </div>
                          )}
                        </>
                      )}
                </CommandGroup>
              )}

              {activeTab === "users" && searchQuery === "" && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/30">
                  <Users2 className="mb-3 size-8" />
                  <p className="text-sm">{t("emptyState.users")}</p>
                </div>
              )}

              {showBeatmapResults && (
                <CommandGroup
                  heading={t("headings.beatmapsets")}
                  className={cn(
                    "transition-opacity duration-200",
                    beatmapsetSearchQuery.isValidating && beatmapsetSearch && beatmapsetSearch.length > 0 && "opacity-50",
                  )}
                >
                  {beatmapsetSearchQuery.isLoading && !beatmapsetSearch
                    ? (
                        Array.from({ length: 3 }, (_, i) => (
                          <CommandItem key={`beatmapset-skeleton-${i}`} disabled className="pointer-events-none">
                            <div className="flex w-full items-center gap-3">
                              <Skeleton className="h-10 w-14 shrink-0 rounded-md" />
                              <div className="flex-1 space-y-1.5">
                                <Skeleton className="h-3.5 w-40 rounded" />
                                <Skeleton className="h-2.5 w-24 rounded" />
                              </div>
                            </div>
                          </CommandItem>
                        ))
                      )
                    : (
                        <>
                          {beatmapsetSearch?.map((result, i) => (
                            <CommandItem
                              key={`beatmapset-${result.id}`}
                              onSelect={() => openPage(`/beatmapsets/${result.id}`)}
                              style={{ animation: `profile-item-slide-in 300ms ease-out ${i * 50}ms backwards` }}
                            >
                              <div className="relative h-10 w-14 flex-shrink-0 overflow-hidden rounded-md shadow-sm ring-1 ring-white/10 duration-500 animate-in fade-in fill-mode-both">
                                <ImageWithFallback
                                  src={`https://assets.ppy.sh/beatmaps/${result.id}/covers/list@2x.jpg`}
                                  alt=""
                                  fill={true}
                                  objectFit="cover"
                                  fallBackSrc="/images/unknown-beatmap-banner.jpg"
                                />
                              </div>
                              <div className="flex min-w-0 flex-col gap-0.5">
                                <div className="flex min-w-0 items-center gap-1.5">
                                  <span className="shrink-0">
                                    <BeatmapStatusIcon status={result.status} />
                                  </span>
                                  <span className="truncate text-sm font-medium">
                                    {result.artist} - {result.title}
                                  </span>
                                </div>
                                <span className="truncate text-xs text-muted-foreground/50">
                                  mapped by {result.creator}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                          {beatmapsetSearch && beatmapsetSearch.length === 0 && !beatmapsetSearchQuery.isValidating && (
                            <div className="py-6 text-center text-sm text-muted-foreground/50">
                              {t("noBeatmapsetsFound")}
                            </div>
                          )}
                        </>
                      )}
                </CommandGroup>
              )}

              {activeTab === "beatmaps" && searchQuery === "" && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/30">
                  <Music className="mb-3 size-8" />
                  <p className="text-sm">{t("emptyState.beatmaps")}</p>
                </div>
              )}

              {showPages && filteredPages.length > 0 && (
                <CommandGroup heading={t("headings.pages")}>
                  {filteredPages.map((page, i) => (
                    <CommandItem
                      key={page.url}
                      onSelect={() => openPage(page.url)}
                      style={
                        searchQuery !== ""
                          ? { animation: `profile-item-slide-in 300ms ease-out ${i * 50}ms backwards` }
                          : undefined
                      }
                    >
                      {page.icon}
                      <span>{page.title}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchQuery !== ""
                && activeTab === "all"
                && (!userSearch || userSearch.length === 0)
                && (!beatmapsetSearch || beatmapsetSearch.length === 0)
                && filteredPages.length === 0
                && !userSearchQuery.isLoading
                && !beatmapsetSearchQuery.isLoading && (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/30">
                  <Search className="mb-3 size-8" />
                  <p className="text-sm">{t("noResultsFound")}</p>
                </div>
              )}
            </CommandList>

            <div className="flex items-center gap-4 border-t border-white/5 bg-white/[0.02] px-4 py-3 text-[11px] text-white/40 shadow-inner">
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-white/50 shadow-sm">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-white/50 shadow-sm">↵</kbd>
                open
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-white/50 shadow-sm">esc</kbd>
                close
              </span>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
