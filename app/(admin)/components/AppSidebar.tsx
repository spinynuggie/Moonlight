"use client";

import { ChevronsUp, Home, Music2, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SWRInfiniteResponse } from "swr/infinite";

import { SidebarUser } from "@/app/(admin)/components/SidebarUser";
import HeaderLoginDialog from "@/components/Header/HeaderLoginDialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useBeatmapSetGetHypedSets } from "@/lib/hooks/api/beatmap/useBeatmapSetHypedSets";
import useSelf from "@/lib/hooks/useSelf";
import type { HypedBeatmapSetsResponse } from "@/lib/types/api";
import { UserBadge } from "@/lib/types/api";

const infoTabs = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Users",
    url: "/admin/users/search",
    icon: Users,
    requires: UserBadge.ADMIN,
  },
];

const actionTabs = [
  {
    title: "Beatmap ranking",
    url: "/admin/beatmaps/search",
    icon: Music2,
    requires: UserBadge.BAT,
  },
  {
    title: "Beatmap requests",
    url: "/admin/beatmaps/requests",
    icon: ChevronsUp,
    requires: UserBadge.BAT,
    beatmapsRequestBadge: (
      requestsQuery: SWRInfiniteResponse<HypedBeatmapSetsResponse, any>,
    ) => {
      const { data } = requestsQuery;

      return (
        data?.find(item => item.total_count !== undefined)?.total_count ?? 0
      );
    },
  },
];

export function AppSidebar() {
  const { self } = useSelf();
  const pathname = usePathname();
  const requestsQuery = useBeatmapSetGetHypedSets();

  const isActive = (url: string) => {
    if (url === "/admin/dashboard") {
      return pathname === "/admin/dashboard" || pathname === "/admin";
    }
    return pathname.startsWith(url);
  };

  const infoTabsWithAccess = infoTabs.filter((item) => {
    if (!self)
      return false;

    const requirements = item.requires && !self.badges.includes(item.requires);
    return !requirements;
  });

  const actionTabsWithAccess = actionTabs.filter((item) => {
    if (!self)
      return false;

    const requirements = item.requires && !self.badges.includes(item.requires);
    return !requirements;
  });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/dashboard">
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <span className="text-lg font-semibold tracking-tight">
                    <span className="text-primary">Hime</span>
                    <span className="text-foreground">joshi</span>
                  </span>
                  <span className="text-xs text-muted-foreground">Admin Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {self ? (infoTabsWithAccess.length > 0 ? "Information" : "") : null}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {infoTabsWithAccess.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            {self ? (actionTabsWithAccess.length > 0 ? "Actions" : "") : null}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {actionTabsWithAccess.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.beatmapsRequestBadge && (
                    <SidebarMenuBadge>
                      {item.beatmapsRequestBadge(requestsQuery)}
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />
      <SidebarFooter>
        {self ? <SidebarUser self={self} /> : <HeaderLoginDialog />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
