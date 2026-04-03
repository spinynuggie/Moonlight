"use client";
import { Music2 } from "lucide-react";
import Image from "next/image";
import { use } from "react";

import Spinner from "@/components/Spinner";
import { useBeatmap } from "@/lib/hooks/api/beatmap/useBeatmap";
import { useT } from "@/lib/i18n/utils";
import { tryParseNumber } from "@/lib/utils/type.util";

interface BeatmapsProps {
  params: Promise<{ id: string }>;
}

export default function BeatmapsRedirect(props: BeatmapsProps) {
  const t = useT("pages.beatmaps.detail");
  const params = use(props.params);
  const beatmapQuery = useBeatmap(tryParseNumber(params.id) ?? 0);
  const beatmap = beatmapQuery.data;

  if (beatmap) {
    window.location.href = `/beatmapsets/${beatmap.beatmapset_id}/${params.id}`;
  }

  if (beatmapQuery.error) {
    return (
      <div className="overflow-hidden rounded-[10px] border border-border/50 bg-card p-6 shadow-md">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Music2 className="size-5" />
              <span className="text-sm font-medium">{t("header")}</span>
            </div>
            <h1 className="text-3xl font-bold">{t("notFound.title")}</h1>
            <p className="text-muted-foreground">{t("notFound.description")}</p>
          </div>
          <Image
            src="/images/user-not-found.png"
            alt="404"
            width={200}
            height={400}
            className="max-w-fit"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-96 items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
