import {
  BookCopy,
  ChartColumnIncreasing,
  ChevronRight,
  Cog,
  DoorOpen,
  Heart,
  Home,
  LucideHistory,
  Menu,
  MonitorCog,
  Search,
  UserIcon,
  Users2,
  UsersRoundIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type {
  Dispatch,
  SetStateAction,
} from "react";
import {
  createContext,
  Suspense,
  useMemo,
  useState,
} from "react";

import HeaderLoginDialog from "@/components/Header/HeaderLoginDialog";
import { HeaderLogoutAlert } from "@/components/Header/HeaderLogoutAlert";
import HeaderSearchCommand from "@/components/Header/HeaderSearchCommand";
import { LanguageSelector } from "@/components/Header/LanguageSelector";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import { cn } from "@/lib/utils";
import { isUserCanUseAdminPanel } from "@/lib/utils/userPrivileges.util";

export const MobileDrawerContext = createContext<Dispatch<
  SetStateAction<boolean>
> | null>(null);

function DrawerNavItem({
  href,
  icon,
  label,
  className,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <DrawerClose asChild>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground",
          className,
        )}
      >
        {icon}
        <span className="flex-1">{label}</span>
        <ChevronRight className="size-3.5 text-muted-foreground/30" />
      </Link>
    </DrawerClose>
  );
}

export default function HeaderMobileDrawer() {
  const t = useT("components.headerMobileDrawer");
  const [open, setOpen] = useState(false);

  const { self } = useSelf();

  const navigationList = useMemo(() => {
    const list = [
      {
        icon: <Home className="size-4" />,
        title: t("navigation.home"),
        url: "/",
      },
      {
        icon: <ChartColumnIncreasing className="size-4" />,
        title: t("navigation.leaderboard"),
        url: "/leaderboard",
      },
      {
        icon: <LucideHistory className="size-4" />,
        title: t("navigation.topPlays"),
        url: "/topplays",
      },
      {
        icon: <Search className="size-4" />,
        title: t("navigation.beatmapsSearch"),
        url: "/beatmaps/search",
      },
      {
        icon: <BookCopy className="size-4" />,
        title: t("navigation.wiki"),
        url: "/wiki",
      },
      {
        icon: <BookCopy className="size-4" />,
        title: t("navigation.rules"),
        url: "/rules",
      },
      {
        icon: <BookCopy className="size-4" />,
        title: t("navigation.apiDocs"),
        url: `https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/docs`,
      },
    ];

    if (process.env.NEXT_PUBLIC_DISCORD_LINK) {
      list.push({
        icon: <UsersRoundIcon className="size-4" />,
        title: t("navigation.discordServer"),
        url: process.env.NEXT_PUBLIC_DISCORD_LINK,
      });
    }

    if (
      process.env.NEXT_PUBLIC_KOFI_LINK
      || process.env.NEXT_PUBLIC_BOOSTY_LINK
    ) {
      list.push({
        icon: <Heart className="size-4" />,
        title: t("navigation.supportUs"),
        url: "/support",
      });
    }

    return list;
  }, [t]);

  return (
    <MobileDrawerContext value={setOpen}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger>
          <Menu />
        </DrawerTrigger>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="px-0 pb-0 text-left">
            <DrawerTitle className="sr-only">Menu</DrawerTitle>

            <div className="flex items-center justify-between">
              {self ? (
                <DrawerClose asChild>
                  <Link
                    href={`/user/${self.user_id}`}
                    className="group flex min-w-0 flex-1 items-center gap-3"
                  >
                    <Avatar className="size-10 ring-2 ring-border/40">
                      <Suspense fallback={<AvatarFallback>UA</AvatarFallback>}>
                        <Image
                          src={self.avatar_url}
                          width={40}
                          height={40}
                          alt="Avatar"
                          className="object-cover"
                        />
                      </Suspense>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {self.username}
                      </p>
                      <p className="text-xs text-muted-foreground/50">
                        {t("yourProfile")}
                      </p>
                    </div>
                  </Link>
                </DrawerClose>
              ) : (
                <HeaderLoginDialog />
              )}
              <div className="flex items-center gap-1">
                <HeaderSearchCommand />
                <LanguageSelector />
              </div>
            </div>
          </DrawerHeader>

          <ScrollArea className="mt-4 max-h-[65vh]">
            {self && (
              <div className="mb-3">
                <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                  {t("sections.account")}
                </p>
                <div className="rounded-xl bg-accent/40 p-1">
                  <DrawerNavItem
                    href={`/user/${self.user_id}`}
                    icon={<UserIcon className="size-4" />}
                    label={t("yourProfile")}
                  />
                  <DrawerNavItem
                    href="/friends"
                    icon={<Users2 className="size-4" />}
                    label={t("friends")}
                  />
                  <DrawerNavItem
                    href="/settings"
                    icon={<Cog className="size-4" />}
                    label={t("settings")}
                  />
                  {isUserCanUseAdminPanel(self) && (
                    <DrawerNavItem
                      href="/admin"
                      icon={<MonitorCog className="size-4" />}
                      label={t("adminPanel")}
                    />
                  )}
                </div>
              </div>
            )}

            <div className="mb-3">
              <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                {t("sections.navigation")}
              </p>
              <div className="rounded-xl bg-accent/40 p-1">
                {navigationList.map(tag => (
                  <DrawerNavItem
                    key={tag.url}
                    href={tag.url}
                    icon={tag.icon}
                    label={tag.title}
                  />
                ))}
              </div>
            </div>

            {self && (
              <div className="rounded-xl bg-accent/40 p-1">
                <HeaderLogoutAlert className="w-full">
                  <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive/80 transition-colors hover:bg-destructive/10 hover:text-destructive">
                    <DoorOpen className="size-4" />
                    <span className="flex-1 text-left">{t("logOut")}</span>
                  </div>
                </HeaderLogoutAlert>
              </div>
            )}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </MobileDrawerContext>
  );
}
