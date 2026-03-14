"use client";

import { ChevronsUp, Home, Music2, Users } from "lucide-react";
import Link from "next/link";
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
  const requestsQuery = useBeatmapSetGetHypedSets();

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
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {self ? (infoTabsWithAccess.length > 0 ? "Information" : "") : null}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {infoTabsWithAccess.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>
            {self ? (actionTabsWithAccess.length > 0 ? "Actions" : "") : null}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {actionTabsWithAccess.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
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
    </Sidebar>
  );
}
