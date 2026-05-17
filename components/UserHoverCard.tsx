"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import UserPrivilegeBadges from "@/app/(website)/user/[id]/components/UserPrivilegeBadges";
import UserStatusText from "@/app/(website)/user/[id]/components/UserStatusText";
import { FriendshipButton } from "@/components/FriendshipButton";
import ImageWithFallback from "@/components/ImageWithFallback";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { MaterialSymbolsCircleOutline } from "@/components/ui/icons/circle-outline";
import type { UserResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/utils/getStatusColor";

export default function UserHoverCard({
  user,
  children,
  align,
  asChild,
  includeFriendshipButton = true,
}: {
  user: UserResponse;
  children: React.ReactNode;
  align?: "center" | "start" | "end";
  asChild?: boolean;
  includeFriendshipButton?: boolean;
}) {
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild={asChild}>{children}</HoverCardTrigger>
      <HoverCardContent
        align={align}
        sideOffset={8}
        className="relative w-[320px] overflow-hidden rounded-[20px] border border-border/50 bg-background/75 p-0 shadow-2xl shadow-black/40 backdrop-blur-xl"
      >
        <div className="group/card relative flex flex-col">
          {/* Banner with smooth gradient mask */}
          <div
            className="absolute inset-0 z-0 h-32 opacity-40 transition-opacity duration-300 group-hover/card:opacity-30"
            style={{
              maskImage: "linear-gradient(to bottom, black 20%, transparent 100%)",
              WebkitMaskImage: "-webkit-linear-gradient(top, black 40%, transparent 100%)",
            }}
          >
            <ImageWithFallback
              src={user?.banner_url}
              alt=""
              fill={true}
              objectFit="cover"
              className="bg-muted saturate-[1.1]"
              fallBackSrc="/images/placeholder.png"
            />
          </div>

          <Link
            href={`/user/${user.user_id}`}
            className="relative z-10 block p-5 pb-3"
          >
            <div className="flex items-start justify-between">
              <div className="relative z-10 transition-transform duration-300 group-hover/card:scale-[1.03]">
                <Image
                  src={user?.avatar_url}
                  alt={`${user.username}'s profile`}
                  objectFit="cover"
                  width={64}
                  height={64}
                  className="rounded-full border-2 border-background/60 shadow-lg"
                />
              </div>

              {includeFriendshipButton && (
                <div className="mt-1">
                  <FriendshipButton
                    userId={user.user_id}
                    className="size-9 rounded-full border border-primary/20 bg-primary/[0.08] backdrop-blur-sm transition-colors hover:bg-primary/[0.15] hover:text-primary"
                    includeText={false}
                  />
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-[20px] font-bold leading-tight text-white drop-shadow-md transition-colors group-hover/card:text-primary">
                  {user.username}
                </h2>
                <img
                  src={`/images/flags/${user.country_code}.png`}
                  alt="User Flag"
                  className="h-[16px] w-[22px] rounded-sm object-cover opacity-90 shadow-sm"
                />
              </div>

              <div
                className="flex flex-wrap gap-1.5"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                <UserPrivilegeBadges badges={user.badges} small={true} />
              </div>
            </div>
          </Link>

          {/* Status box */}
          <div className="relative z-10 px-5 pb-5 pt-2">
            <div className="flex w-full items-center space-x-2.5 rounded-[12px] border border-white/[0.05] bg-white/[0.03] px-3 py-2 text-sm font-medium shadow-inner transition-colors hover:bg-white/[0.05]">
              <MaterialSymbolsCircleOutline
                className={cn(
                  "text-[18px] drop-shadow-md",
                  getStatusColor(user.user_status),
                )}
              />
              <div className="line-clamp-1 flex-grow text-white/80">
                <UserStatusText user={user} />
              </div>
            </div>
          </div>

        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
