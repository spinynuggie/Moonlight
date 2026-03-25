"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

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

export default function Header() {
  const t = useT("components.header");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const className = scrolled ? "bg-card" : "bg-background hover:bg-card";

  return (
    <header className="sticky top-0 z-50 bg-background">
      <div
        className={twMerge(
          `left-0 group relative right-0 top-0 z-50 hove flex items-center border-b border-border justify-between row-padding py-2 smooth-transition`,
          scrolled ? `shadow-md` : ``,
          className,
        )}
      >
        <div className="flex items-center">
          <a href="/" className="smooth-transition">
            <Brand />
          </a>
        </div>

        <div className="hidden items-center text-sm font-medium md:flex lg:space-x-4">
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

        <div className="hidden items-center space-x-6 md:flex">
          <HeaderSearchCommand />
          <LanguageSelector />
          <HeaderAvatar />
        </div>

        <div className="flex space-x-6 md:hidden">
          <HeaderMobileDrawer />
        </div>
      </div>
    </header>
  );
}
