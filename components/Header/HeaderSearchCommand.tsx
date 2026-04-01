"use client";

import {
  BookCopy,
  ChartColumnIncreasing,
  Clock,
  Cog,
  LucideHistory,
  Search,
  Trash2,
  UserIcon,
  Users2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import BeatmapsetRowElement from "@/components/BeatmapsetRowElement";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useBeatmapsetSearch } from "@/lib/hooks/api/beatmap/useBeatmapsetSearch";
import { useUserSearch } from "@/lib/hooks/api/user/useUserSearch";
import useDebounce from "@/lib/hooks/useDebounce";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import { BeatmapStatusWeb } from "@/lib/types/api";
import { cn } from "@/lib/utils";

import UserRowElement from "../UserRowElement";

const RECENT_SEARCHES_KEY = "moonlight-recent-searches";
const MAX_RECENT_SEARCHES = 5;

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
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchValue = useDebounce<string>(searchQuery, 450);

  const pagesList = useMemo(
    () => [
      {
        icon: <ChartColumnIncreasing />,
        title: t("pages.leaderboard"),
        url: "/leaderboard",
        filter: "Leaderboard",
      },
      {
        icon: <LucideHistory />,
        title: t("pages.topPlays"),
        url: "/topplays",
        filter: "Top plays",
      },
      {
        icon: <Search />,
        title: t("pages.beatmapsSearch"),
        url: "/beatmaps/search",
        filter: "Beatmaps search",
      },
      {
        icon: <BookCopy />,
        title: t("pages.wiki"),
        url: "/wiki",
        filter: "Wiki",
      },
      {
        icon: <BookCopy />,
        title: t("pages.rules"),
        url: "/rules",
        filter: "Rules",
      },
      {
        icon: <UserIcon />,
        title: t("pages.yourProfile"),
        url: self !== undefined ? `/user/${self.user_id}` : "",
        filter: "Your profile",
        disabled: !self,
      },
      {
        icon: <Users2 />,
        title: t("pages.friends"),
        url: "/friends",
        filter: "Friends",
        disabled: !self,
      },
      {
        icon: <Cog />,
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
    undefined,
    undefined,
    {
      refreshInterval: 0,
    },
  );

  const userSearch = userSearchQuery.data;
  const beatmapsetSearch = beatmapsetSearchQuery.data?.flatMap(d => d.sets);

  useEffect(() => {
    if (open) {
      setRecentSearches(getRecentSearches());
    }
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

  const openPage = (url: string) => {
    if (searchQuery.trim()) {
      addRecentSearch(searchQuery);
    }
    setOpen(false);
    setTimeout(() => {
      router.push(url);
    }, 100);
  };

  const filterElement = (value: string) => {
    if (value.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;
    return true;
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(open => !open)}
        className="smooth-transition size-7 cursor-pointer rounded-md p-1 opacity-40 hover:bg-accent group-hover:opacity-100 group-data-[scrolled]:opacity-100"
      >
        <Search />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          value={searchQuery}
          onValueChange={setSearchQuery}
          placeholder={t("placeholder")}
        />
        <DialogTitle />
        <CommandList>
          {searchQuery === "" && recentSearches.length > 0 && (
            <CommandGroup heading="Recent">
              {recentSearches.map(search => (
                <CommandItem
                  key={`recent-${search}`}
                  onSelect={() => setSearchQuery(search)}
                  className="flex items-center gap-2"
                >
                  <Clock className="size-4 flex-shrink-0 text-muted-foreground" />
                  <span className="flex-grow truncate">{search}</span>
                  <button
                    className="flex-shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentSearch(search);
                      setRecentSearches(prev => prev.filter(s => s !== search));
                    }}
                  >
                    <X className="size-3" />
                  </button>
                </CommandItem>
              ))}
              <CommandItem
                onSelect={() => {
                  clearRecentSearches();
                  setRecentSearches([]);
                }}
                className="flex items-center gap-2"
              >
                <Trash2 className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Clear recent searches</span>
              </CommandItem>
            </CommandGroup>
          )}
          {searchQuery === "" && recentSearches.length > 0 && <CommandSeparator />}
          <CommandGroup
            heading={t("headings.users")}
            className={cn(
              "transition-opacity duration-200",
              searchQuery !== "" && userSearchQuery.isValidating && userSearch && userSearch.length > 0 && "opacity-60",
            )}
          >
            {searchQuery === ""
              ? null
              : userSearchQuery.isLoading && !userSearch
                ? (
                    Array.from({ length: 3 }, (_, i) => (
                      <CommandItem key={`user-skeleton-${i}`} disabled className="pointer-events-none">
                        <div className="flex w-full items-center gap-3">
                          <Skeleton className="size-8 shrink-0 rounded-full" />
                          <Skeleton className="h-3.5 w-24 rounded" />
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
                          style={{ animation: `fade-in 150ms ease-out ${i * 30}ms backwards` }}
                        >
                          <UserRowElement user={result} />
                        </CommandItem>
                      ))}
                      {userSearch && userSearch.length === 0 && !userSearchQuery.isValidating && (
                        <p className="py-3 text-center text-sm text-muted-foreground">{t("noUsersFound")}</p>
                      )}
                    </>
                  )}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup
            heading={t("headings.beatmapsets")}
            className={cn(
              "transition-opacity duration-200",
              searchQuery !== "" && beatmapsetSearchQuery.isValidating && beatmapsetSearch && beatmapsetSearch.length > 0 && "opacity-60",
            )}
          >
            {searchQuery === ""
              ? null
              : beatmapsetSearchQuery.isLoading && !beatmapsetSearch
                ? (
                    Array.from({ length: 3 }, (_, i) => (
                      <CommandItem key={`beatmapset-skeleton-${i}`} disabled className="pointer-events-none p-0">
                        <div className="flex w-full items-center gap-3 px-2 py-1.5">
                          <Skeleton className="h-8 w-12 shrink-0 rounded" />
                          <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3.5 w-36 rounded" />
                            <Skeleton className="h-3 w-24 rounded" />
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
                          className="p-0"
                          onSelect={() => openPage(`/beatmapsets/${result.id}`)}
                          style={{ animation: `fade-in 150ms ease-out ${i * 30}ms backwards` }}
                        >
                          <BeatmapsetRowElement beatmapSet={result} />
                        </CommandItem>
                      ))}
                      {beatmapsetSearch && beatmapsetSearch.length === 0 && !beatmapsetSearchQuery.isValidating && (
                        <p className="py-3 text-center text-sm text-muted-foreground">{t("noBeatmapsetsFound")}</p>
                      )}
                    </>
                  )}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t("headings.pages")}>
            {pagesList.map(page => (
              <CommandItem
                key={page.url}
                onSelect={() => openPage(page.url)}
                disabled={page.disabled}
                className={filterElement(page.filter) ? "hidden" : ""}
              >
                {page.icon}
                <span>{page.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
