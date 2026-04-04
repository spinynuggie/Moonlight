"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

import { Brand } from "@/components/Brand";
import HeaderAvatar from "@/components/Header/HeaderAvatar";
import HeaderLink from "@/components/Header/HeaderLink";
import HeaderMobileDrawer from "@/components/Header/HeaderMobileDrawer";
import HeaderSearchCommand from "@/components/Header/HeaderSearchCommand";
import { LanguageSelector } from "@/components/Header/LanguageSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useT } from "@/lib/i18n/utils";
import { cn } from "@/lib/utils";

export default function Header() {
  const t = useT("components.header");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useLayoutEffect(() => {
    setScrolled(window.scrollY > 30);
  }, [pathname]);

  useEffect(() => {
    setScrolled(window.scrollY > 30);
    requestAnimationFrame(() => setAnimationsEnabled(true));
  }, []);

  const transitionClass = animationsEnabled
    ? "transition-[padding-top,padding-bottom,opacity,transform] duration-300 ease-out"
    : "transition-none";

  return (
    <header className="sticky top-0 z-50">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 border-b border-border bg-card shadow-md",
          transitionClass,
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        className={cn(
          "row-padding group relative z-10 flex items-center justify-between",
          "md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:justify-normal",
          transitionClass,
          scrolled ? "py-2" : "py-4",
        )}
        data-scrolled={scrolled || undefined}
      >
        <Link
          href="/"
          className="smooth-transition shrink-0 justify-self-start md:min-w-0"
        >
          <div
            className={cn("origin-left", transitionClass)}
            style={{ transform: scrolled ? "scale(0.85)" : "scale(1)" }}
          >
            <Brand />
          </div>
        </Link>

        <div className="hidden min-w-0 items-center justify-self-center text-sm font-medium md:flex lg:space-x-4">
          <HeaderLink name={t("links.leaderboard")} href="/leaderboard" />
          <HeaderLink name={t("links.topPlays")} href="/topplays" />
          <HeaderLink name={t("links.beatmaps")} href="/beatmaps/search" />

          <DropdownMenu>
            <DropdownMenuTrigger className="focus-visible:outline-none">
              <HeaderLink name={t("links.help")} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup className="space-y-2 p-2">
                <DropdownMenuItem asChild>
                  <Link href="/wiki">{t("links.wiki")}</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/rules">{t("links.rules")}</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    href={`https://api.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/docs`}
                  >
                    {t("links.apiDocs")}
                  </Link>
                </DropdownMenuItem>

                {process.env.NEXT_PUBLIC_DISCORD_LINK && (
                  <DropdownMenuItem asChild>
                    <Link href={process.env.NEXT_PUBLIC_DISCORD_LINK}>
                      {t("links.discordServer")}
                    </Link>
                  </DropdownMenuItem>
                )}

                {(process.env.NEXT_PUBLIC_KOFI_LINK
                  || process.env.NEXT_PUBLIC_BOOSTY_LINK) && (
                  <DropdownMenuItem asChild>
                    <Link href="/support">{t("links.supportUs")}</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex shrink-0 items-center justify-end space-x-6 justify-self-end">
          <div className="hidden items-center space-x-6 md:flex">
            <HeaderSearchCommand />
            <LanguageSelector />
            <HeaderAvatar />
          </div>
          <div className="flex md:hidden">
            <HeaderMobileDrawer />
          </div>
        </div>
      </div>
    </header>
  );
}
