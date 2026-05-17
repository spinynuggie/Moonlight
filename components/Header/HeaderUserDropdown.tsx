"use client";

import {
  Cog,
  Home,
  LogOutIcon,
  MonitorCog,
  UserCircleIcon,
  Users2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

import UserPrivilegeBadges from "@/app/(website)/user/[id]/components/UserPrivilegeBadges";
import { HeaderLogoutAlert } from "@/components/Header/HeaderLogoutAlert";
import ImageWithFallback from "@/components/ImageWithFallback";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useT } from "@/lib/i18n/utils";
import type { UserResponse } from "@/lib/types/api";
import { isUserCanUseAdminPanel } from "@/lib/utils/userPrivileges.util";

interface Props {
  self: UserResponse | null;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

export default function HeaderUserDropdown({
  self,
  children,
  side,
  sideOffset,
  align,
}: Props) {
  const t = useT("components.headerUserDropdown");
  const pathname = usePathname();

  return (
    self && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[280px] rounded-[20px] border border-border/50 bg-background/50 p-0 shadow-2xl shadow-black/40 backdrop-blur-2xl"
          side={side}
          sideOffset={sideOffset}
          align={align}
        >
          <DropdownMenuLabel className="relative flex items-center gap-x-3 overflow-hidden rounded-t-[20px] px-4 pb-3 pt-4 font-normal">
            <div
              className="absolute inset-0 z-0 h-full opacity-40 duration-500 animate-in fade-in fill-mode-both"
              style={{
                maskImage: "linear-gradient(to right, black 25%, transparent 100%)",
                WebkitMaskImage: "-webkit-linear-gradient(left, black 25%, transparent 100%)",
              }}
            >
              <ImageWithFallback
                src={self.banner_url}
                alt="user bg"
                fill={true}
                priority={true}
                objectFit="cover"
                className="bg-muted saturate-[1.1]"
                fallBackSrc="/images/placeholder.png"
              />
            </div>

            <Avatar className="z-20 size-14 border-2 border-background/60 shadow-lg delay-75 duration-500 animate-in fade-in fill-mode-both">
              <Suspense fallback={<AvatarFallback>UA</AvatarFallback>}>
                <Image
                  src={self.avatar_url}
                  fill
                  priority={true}
                  alt="Avatar"
                  className="object-cover"
                />
              </Suspense>
            </Avatar>

            <div className="z-20 flex flex-col pt-0.5">
              <div className="truncate pb-0.5 text-lg font-bold text-white drop-shadow-md">
                {self.username}
              </div>

              <UserPrivilegeBadges
                badges={self.badges}
                small
                className="mt-0.5 origin-left scale-90"
              />
            </div>
          </DropdownMenuLabel>

          <div className="p-1.5 pt-0">
            <DropdownMenuSeparator className="-mx-1.5 mb-1.5 mt-0 bg-white/5" />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="rounded-[10px] focus:bg-primary/[0.08]">
                <Link href={`/user/${self.user_id}`} className="cursor-pointer">
                  <UserCircleIcon />
                  {t("myProfile")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer rounded-[10px] focus:bg-primary/[0.08]">
                <Link href="/friends">
                  <Users2 />
                  {t("friends")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer rounded-[10px] focus:bg-primary/[0.08]">
                <Link href="/settings">
                  <Cog />
                  {t("settings")}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            {isUserCanUseAdminPanel(self) && (
              <>
                <DropdownMenuSeparator className="bg-white/5" />

                <DropdownMenuItem asChild className="cursor-pointer rounded-[10px] focus:bg-primary/[0.08]">
                  {pathname.includes("/admin") ? (
                    <Link href="/">
                      <Home />
                      {t("returnToMainSite")}
                    </Link>
                  ) : (
                    <Link href="/admin">
                      <MonitorCog />
                      {t("adminPanel")}
                    </Link>
                  )}
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              onSelect={e => e.preventDefault()}
              asChild
              className="cursor-pointer rounded-[10px] focus:bg-primary/[0.08]"
            >
              <HeaderLogoutAlert className="w-full text-start">
                <LogOutIcon />
                {t("logOut")}
              </HeaderLogoutAlert>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
}
