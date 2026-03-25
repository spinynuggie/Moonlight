"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
  admin: "Admin",
  users: "Users",
  edit: "Edit",
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/")
    return null;

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0)
    return null;

  const items = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = routeLabels[segment] || (Number.isNaN(Number(segment)) ? segment : `#${segment}`);
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
              <span className="font-medium text-foreground">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
