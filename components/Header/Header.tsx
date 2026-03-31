"use client";
import { LayoutGroup, motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 30);
  });

  useEffect(() => {
    setScrolled(window.scrollY > 30);
    requestAnimationFrame(() => setAnimationsEnabled(true));
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      setScrolled(window.scrollY > 30);
    });
  }, [pathname]);

  const transition = { duration: animationsEnabled ? 0.3 : 0, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <header className="sticky top-0 z-50">
      <motion.div
        className="pointer-events-none absolute inset-0 border-b border-border bg-card shadow-md"
        initial={false}
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={transition}
      />

      <motion.div
        className="row-padding group relative z-10 flex items-center justify-between"
        data-scrolled={scrolled || undefined}
        initial={false}
        animate={{
          paddingTop: scrolled ? "0.5rem" : "1rem",
          paddingBottom: scrolled ? "0.5rem" : "1rem",
        }}
        transition={transition}
      >
        <div className="flex items-center">
          <Link href="/" className="smooth-transition">
            <motion.div
              initial={false}
              animate={{ scale: scrolled ? 0.85 : 1 }}
              transition={transition}
              style={{ transformOrigin: "left center" }}
            >
              <Brand />
            </motion.div>
          </Link>
        </div>

        <LayoutGroup>
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
        </LayoutGroup>

        <div className="hidden items-center space-x-6 md:flex">
          <HeaderSearchCommand />
          <LanguageSelector />
          <HeaderAvatar />
        </div>

        <div className="flex space-x-6 md:hidden">
          <HeaderMobileDrawer />
        </div>
      </motion.div>
    </header>
  );
}
