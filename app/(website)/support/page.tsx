"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n/utils";

export default function SupportUs() {
  const t = useT("pages.support");

  return (
    <div className="flex w-full flex-col space-y-2">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="rounded-[10px] border border-border/50 bg-card p-6 shadow-md"
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-6 border-b border-border/40 pb-4">
              <h2 className="text-xl font-bold tracking-tight">{t("header")}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {t.rich("section.intro")}
              </p>
            </div>

            <ol className="relative space-y-12 before:absolute before:left-4 before:top-2 before:h-[calc(100%-1.5rem)] before:w-px before:bg-border/50">
              <li className="relative pl-14">
                <div className="absolute left-0 top-1 flex size-9 items-center justify-center rounded-full border border-primary/20 bg-background text-sm font-bold text-primary ring-4 ring-background">
                  1
                </div>
                <div className="space-y-3">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {t.rich("section.donate.title")}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t.rich("section.donate.description")}
                  </p>
                  <div className="pt-1">
                    <Link
                      href={
                        process.env.NEXT_PUBLIC_DISCORD_LINK
                          ? `https://${process.env.NEXT_PUBLIC_DISCORD_LINK}`
                          : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm" className="rounded-full px-6">
                        {t("section.donate.buttons.discord")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </li>

              <li className="relative pl-14">
                <div className="absolute left-0 top-1 flex size-9 items-center justify-center rounded-full border border-border bg-background text-sm font-bold text-muted-foreground/60 ring-4 ring-background">
                  2
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {t.rich("section.spreadTheWord.title")}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("section.spreadTheWord.description")}
                  </p>
                </div>
              </li>

              <li className="relative pl-14">
                <div className="absolute left-0 top-1 flex size-9 items-center justify-center rounded-full border border-border bg-background text-sm font-bold text-muted-foreground/60 ring-4 ring-background">
                  3
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {t.rich("section.justPlay.title")}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("section.justPlay.description")}
                  </p>
                </div>
              </li>
            </ol>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
