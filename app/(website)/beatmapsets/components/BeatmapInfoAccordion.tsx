import { Info, Rocket } from "lucide-react";
import { useEffect, useState } from "react";

import { BeatmapNomination } from "@/app/(website)/beatmapsets/components/BeatmapNomination";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapResponse, BeatmapSetResponse } from "@/lib/types/api";

export function BeatmapInfoAccordion({
  beatmapSet,
  beatmap,
}: {
  beatmapSet: BeatmapSetResponse;
  beatmap: BeatmapResponse;
}) {
  const t = useT("pages.beatmapsets.components.infoAccordion");
  const [isScreenSmall, setAccordionType] = useState<boolean>(false);

  useEffect(() => {
    const lgBreakpoint = "(min-width: 1024px)";
    const mediaQuery = window.matchMedia(lgBreakpoint);
    const updateType = () => {
      setAccordionType(mediaQuery.matches ? false : true);
    };

    updateType();
    mediaQuery.addEventListener("change", updateType);

    return () => {
      mediaQuery.removeEventListener("change", updateType);
    };
  }, []);

  return isScreenSmall || !beatmapSet.can_be_hyped
    ? (
        <div className="flex h-full flex-col space-y-2">
          {beatmapSet.can_be_hyped && (
            <div className="overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md">
              <div className="flex items-center gap-2 border-b border-border/30 px-4 py-2.5">
                <Rocket className="size-4 text-muted-foreground" />
                <h3 className="text-[13px] font-medium text-muted-foreground">{t("communityHype")}</h3>
              </div>
              <div className="p-4">
                <BeatmapNomination beatmap={beatmap} />
              </div>
            </div>
          )}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md">
            <div className="flex items-center gap-2 border-b border-border/30 px-4 py-2.5">
              <Info className="size-4 text-muted-foreground" />
              <h3 className="text-[13px] font-medium text-muted-foreground">{t("information")}</h3>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <BeatmapMetadata beatmapSet={beatmapSet} />
            </div>
          </div>
        </div>
      )
    : (
        <Accordion type="single" className="space-y-2" defaultValue="info">
          {beatmapSet.can_be_hyped && (
            <AccordionItem value="hype" className="overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md">
              <AccordionTrigger className="border-b border-transparent px-4 py-2.5 hover:no-underline data-[state=open]:border-border/30">
                <div className="flex items-center gap-2">
                  <Rocket className="size-4 text-muted-foreground" />
                  <span className="text-[13px] font-medium text-muted-foreground">{t("communityHype")}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0">
                <div className="max-h-52 overflow-y-auto p-4">
                  <BeatmapNomination beatmap={beatmap} />
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
          <AccordionItem value="info" className="overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md" defaultChecked>
            <AccordionTrigger className="border-b border-transparent px-4 py-2.5 hover:no-underline data-[state=open]:border-border/30">
              <div className="flex items-center gap-2">
                <Info className="size-4 text-muted-foreground" />
                <span className="text-[13px] font-medium text-muted-foreground">{t("information")}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <div className="max-h-52 overflow-y-auto p-4">
                <BeatmapMetadata beatmapSet={beatmapSet} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
}

function BeatmapMetadata({ beatmapSet }: { beatmapSet: BeatmapSetResponse }) {
  const t = useT("pages.beatmapsets.components.infoAccordion.metadata");
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <p className="text-xs text-muted-foreground">{t("genre")}</p>
          <p className="text-sm font-semibold">{beatmapSet.genre}</p>
        </div>
        <div className="flex items-baseline justify-between">
          <p className="text-xs text-muted-foreground">{t("language")}</p>
          <p className="text-sm font-semibold">{beatmapSet.language}</p>
        </div>
      </div>
      <div>
        <p className="mb-1 text-xs text-muted-foreground">{t("tags")}</p>
        <p className="text-sm leading-relaxed text-foreground/70">
          {beatmapSet.tags.map(tag => `${tag}`).join(", ")}
        </p>
      </div>
    </div>
  );
}
