"use client";

import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useSWR from "swr";

import { Skeleton } from "@/components/ui/skeleton";
import type {
  BeatmapResponse,
  BeatmapSetResponse,
  UserResponse,
} from "@/lib/types/api";

const routeLabels: Record<string, string> = {
  beatmapsets: "Beatmaps",
  beatmaps: "Beatmaps",
  search: "Search",
  user: "Player",
  leaderboard: "Leaderboard",
  topplays: "Top Plays",
  settings: "Settings",
  wiki: "Wiki",
  rules: "Rules",
  score: "Score",
  friends: "Friends",
  register: "Register",
  support: "Support",
  news: "News",
  admin: "Admin",
  users: "Users",
  edit: "Edit",
  dashboard: "Dashboard",
  requests: "Requests",
};

const nonNavigablePaths = new Set([
  "/user",
  "/beatmapsets",
  "/beatmaps",
  "/score",
  "/admin/users",
  "/admin/beatmaps",
  "/admin/beatmapsets",
]);

function isNavigable(href: string, segments: string[], index: number): boolean {
  if (nonNavigablePaths.has(href))
    return false;
  if (
    index === 2
    && segments[0] === "admin"
    && segments[1] === "users"
    && !Number.isNaN(Number(segments[2]))
  ) {
    return false;
  }
  return true;
}

type IdContext = "user" | "beatmapset" | "beatmap" | "score";

function getIdContext(segments: string[], index: number): IdContext | null {
  const segment = segments[index];
  if (Number.isNaN(Number(segment)))
    return null;

  const prevSegment = segments[index - 1];
  if (!prevSegment)
    return null;

  if (prevSegment === "user" || prevSegment === "users")
    return "user";
  if (prevSegment === "beatmapsets")
    return "beatmapset";
  if (prevSegment === "beatmaps")
    return "beatmap";
  if (prevSegment === "score")
    return "score";

  if (
    index >= 2
    && segments[index - 2] === "beatmapsets"
    && !Number.isNaN(Number(prevSegment))
  ) {
    return "beatmap";
  }

  return null;
}

function UserLabel({ id }: { id: number }) {
  const { data } = useSWR<UserResponse>(`user/${id}`);
  if (!data)
    return <Skeleton className="inline-block h-4 w-16" />;
  return <>{data.username}</>;
}

function BeatmapSetLabel({ id }: { id: number }) {
  const { data } = useSWR<BeatmapSetResponse>(`beatmapset/${id}`);
  if (!data)
    return <Skeleton className="inline-block h-4 w-36" />;
  return <>{data.artist} - {data.title}</>;
}

function BeatmapLabel({ id }: { id: number }) {
  const { data } = useSWR<BeatmapResponse>(`beatmap/${id}`);
  if (!data)
    return <Skeleton className="inline-block h-4 w-16" />;
  return <>{data.version}</>;
}

function ScoreLabel({ id }: { id: number }) {
  return <>Score #{id}</>;
}

function ResolvedLabel({ segment, segments, index }: {
  segment: string;
  segments: string[];
  index: number;
}) {
  const idContext = getIdContext(segments, index);

  if (!idContext) {
    const label = routeLabels[segment];
    if (label)
      return <>{label}</>;
    return Number.isNaN(Number(segment)) ? <>{segment}</> : <>#{segment}</>;
  }

  const id = Number(segment);

  switch (idContext) {
    case "user":
      return <UserLabel id={id} />;
    case "beatmapset":
      return <BeatmapSetLabel id={id} />;
    case "beatmap":
      return <BeatmapLabel id={id} />;
    case "score":
      return <ScoreLabel id={id} />;
  }
}

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/register")
    return null;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0)
    return null;

  const items = segments
    .map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`;
      const isLast = index === segments.length - 1;
      const navigable = !isLast && isNavigable(href, segments, index);
      return { href, segment, isLast, navigable, index };
    })
    .filter((item) => {
      if (
        item.index >= 2
        && segments[item.index - 2] === "beatmapsets"
        && !Number.isNaN(Number(item.segment))
      ) {
        return false;
      }
      return true;
    });

  if (items.length > 0) {
    const last = items.at(-1)!;
    last.isLast = true;
    last.navigable = false;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <motion.ol
        key={pathname}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <li>
          <Link
            href="/"
            className="transition-colors hover:text-foreground"
          >
            <Home className="size-3.5" />
          </Link>
        </li>
        {items.map(item => (
          <li key={item.href} className="flex items-center gap-1.5">
            <ChevronRight className="size-3 text-muted-foreground/50" />
            {item.isLast ? (
              <span className="font-medium text-foreground">
                <ResolvedLabel segment={item.segment} segments={segments} index={item.index} />
              </span>
            ) : item.navigable
              ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    <ResolvedLabel segment={item.segment} segments={segments} index={item.index} />
                  </Link>
                )
              : (
                  <span>
                    <ResolvedLabel segment={item.segment} segments={segments} index={item.index} />
                  </span>
                )}
          </li>
        ))}
      </motion.ol>
    </nav>
  );
}
