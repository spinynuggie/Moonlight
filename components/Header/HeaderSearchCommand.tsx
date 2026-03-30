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
import { EosIconsThreeDotsLoading } from "@/components/ui/icons/three-dots-loading";
import { useBeatmapsetSearch } from "@/lib/hooks/api/beatmap/useBeatmapsetSearch";
import { useUserSearch } from "@/lib/hooks/api/user/useUserSearch";
import useDebounce from "@/lib/hooks/useDebounce";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import { BeatmapStatusWeb } from "@/lib/types/api";

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
          <CommandGroup heading={t("headings.users")}>
            {userSearchQuery.isLoading && !userSearch ? (
              <div className="flex h-12 w-full justify-center">
                <EosIconsThreeDotsLoading className="text-4xl" />
              </div>
            ) : (
              searchQuery !== ""
              && userSearch?.map(result => (
                <CommandItem
                  key={`user-${result.user_id}}`}
                  onSelect={() => openPage(`/user/${result.user_id}`)}
                >
                  <UserRowElement user={result} />
                </CommandItem>
              ))
            )}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading={t("headings.beatmapsets")}>
            {beatmapsetSearchQuery.isLoading && !beatmapsetSearch ? (
              <div className="flex h-12 w-full justify-center">
                <EosIconsThreeDotsLoading className="text-4xl" />
              </div>
            ) : (
              searchQuery !== ""
              && beatmapsetSearch?.map(result => (
                <CommandItem
                  key={`beatmapset-${result.id}`}
                  className="p-0"
                  onSelect={() => openPage(`/beatmapsets/${result.id}`)}
                >
                  <BeatmapsetRowElement beatmapSet={result} />
                </CommandItem>
              ))
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
