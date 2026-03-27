"use client";
import { Github, Heart, ServerCrash, VoteIcon } from "lucide-react";

import { IcBaselineDiscord } from "@/components/ui/icons/ic-baseline-discord";
import { useT } from "@/lib/i18n/utils";

export default function Footer() {
  const t = useT("components.footer");
  const tBrand = useT("general.serverTitle.split");

  const discordUrl = process.env.NEXT_PUBLIC_DISCORD_LINK;

  return (
    <footer className="bg-background px-4 py-8 text-center text-sm">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-4">
        <div className="flex items-center gap-0.5 text-lg font-semibold tracking-tight">
          <span className="text-primary">{tBrand("part1")}</span>
          <span className="text-foreground">{tBrand("part2")}</span>
        </div>
        {process.env.NEXT_PUBLIC_OSU_SERVER_LIST_LINK && (
          <a
            href={process.env.NEXT_PUBLIC_OSU_SERVER_LIST_LINK}
            className="smooth-transition inline-flex items-center justify-center gap-2 font-bold hover:scale-105"
          >
            <VoteIcon className="size-4" />
            <span className="animate-gradient bg-gradient-to-r from-stone-400 via-orange-300 to-amber-600 bg-size-300 bg-clip-text text-transparent">
              {t("voteMessage")}
            </span>
          </a>
        )}

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-muted-foreground">
          <a
            href="https://github.com/himejoshi-gay/Moonlight"
            className="smooth-transition inline-flex items-center gap-1.5 hover:text-foreground"
          >
            <Github className="size-4" />
            {t("sourceCode")}
          </a>

          {process.env.NEXT_PUBLIC_STATUS_PAGE_LINK && (
            <a
              href={process.env.NEXT_PUBLIC_STATUS_PAGE_LINK}
              className="smooth-transition inline-flex items-center gap-1.5 hover:text-foreground"
            >
              <ServerCrash className="size-4" />
              {t("serverStatus")}
            </a>
          )}

          {discordUrl && (
            <a
              href={discordUrl}
              className="smooth-transition inline-flex items-center gap-1.5 hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IcBaselineDiscord className="size-4" />
              Discord
            </a>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
          <p className="max-w-xl">{t("disclaimer")}</p>

          <p className="inline-flex items-center gap-1.5">
            Maintained with
            <Heart className="size-3 fill-primary text-primary" />
            by
            <a
              href="https://asteria.cat"
              className="smooth-transition font-medium text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              asteria
            </a>
          </p>
        </div>

        <p className="text-xs text-muted-foreground">{t("copyright")}</p>
      </div>
    </footer>
  );
}
