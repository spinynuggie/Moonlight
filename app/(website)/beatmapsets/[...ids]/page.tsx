"use client";
import { Book, Clapperboard, Music2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";

import { BeatmapDropdown } from "@/app/(website)/beatmapsets/components/BeatmapDropdown";
import { BeatmapInfoAccordion } from "@/app/(website)/beatmapsets/components/BeatmapInfoAccordion";
import BeatmapLeaderboard from "@/app/(website)/beatmapsets/components/BeatmapLeaderboard";
import { BeatmapNominatorUser } from "@/app/(website)/beatmapsets/components/BeatmapNominatorUser";
import DifficultyInformation from "@/app/(website)/beatmapsets/components/DifficultyInformation";
import DifficultySelector from "@/app/(website)/beatmapsets/components/DifficultySelector";
import DownloadButtons from "@/app/(website)/beatmapsets/components/DownloadButtons";
import FavouriteButton from "@/app/(website)/beatmapsets/components/FavouriteButton";
import { BBCodeReactParser } from "@/components/BBCode/BBCodeReactParser";
import { GameModeIcon } from "@/components/DifficultyIcon";
import { FilterOption } from "@/components/FilterOption";
import { FilterPanel } from "@/components/FilterPanel";
import PrettyDate from "@/components/General/PrettyDate";
import RoundedContent from "@/components/General/RoundedContent";
import ImageWithFallback from "@/components/ImageWithFallback";
import { BeatmapsetDetailSkeleton } from "@/components/Skeletons/Beatmaps/BeatmapsetDetailSkeleton";
import { Tooltip } from "@/components/Tooltip";
import { useBeatmapSet } from "@/lib/hooks/api/beatmap/useBeatmapSet";
import { GameRuleFlags, GameRulesGameModes } from "@/lib/hooks/api/types";
import { useT } from "@/lib/i18n/utils";
import type { BeatmapResponse } from "@/lib/types/api";
import { BeatmapStatusWeb, GameMode } from "@/lib/types/api";
import { makeBeatmapSearchUrl } from "@/lib/utils/beatmapSearch";
import { gameModeToGamerule, gameModeToVanilla } from "@/lib/utils/gameMode.util";
import { getStatusPillStyle } from "@/lib/utils/getStatusPillStyle";
import { isInstance, tryParseNumber } from "@/lib/utils/type.util";

export interface BeatmapsetProps {
  params: Promise<{ ids: Array<string | undefined> }>;
}

export default function Beatmapset(props: BeatmapsetProps) {
  const t = useT("pages.beatmapsets");
  const params = use(props.params);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const mode = searchParams.get("mode") ?? "";

  const [beatmapSetId, beatmapId] = params.ids;

  const [activeMode, setActiveMode] = useState<GameMode | null>(
    () => (isInstance(mode, GameMode) ? (mode as GameMode) : null),
  );

  const [activeBeatmap, setActiveBeatmap] = useState<BeatmapResponse | null>(
    null,
  );

  const beatmapsetQuery = useBeatmapSet(
    tryParseNumber(beatmapSetId ?? "") ?? null,
  );
  const beatmapSet = beatmapsetQuery.data;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    if (!beatmapSet)
      return;

    const beatmap = beatmapSet.beatmaps.find(
      beatmap => beatmap.id === Number(beatmapId),
    );

    const activeBeatmap = beatmap ?? beatmapSet.beatmaps?.[0];

    setActiveBeatmap(activeBeatmap);
    if (!activeMode && activeBeatmap)
      setActiveMode(activeBeatmap.mode);
  }, [activeMode, beatmapId, beatmapSet]);

  useEffect(() => {
    if (
      !beatmapSet
      || [activeMode && gameModeToVanilla(activeMode), GameMode.STANDARD].includes(
        activeBeatmap?.mode ?? GameMode.STANDARD,
      )
    ) {
      return;
    }

    const beatmap = beatmapSet.beatmaps.find(
      beatmap => beatmap.mode === activeMode,
    );

    const activeBeatmapNew = beatmap ?? beatmapSet.beatmaps?.[0];

    setActiveBeatmap(activeBeatmapNew);
    if (activeBeatmapNew)
      setActiveMode(activeBeatmapNew.mode);
  }, [activeBeatmap?.mode, activeMode, beatmapSet]);

  useEffect(() => {
    if (!activeMode)
      return;

    window.history.replaceState(
      null,
      "",
      `${pathname}?${createQueryString("mode", activeMode.toString())}`,
    );
  }, [activeMode, createQueryString, pathname]);

  useEffect(() => {
    if (!activeBeatmap)
      return;

    if (activeBeatmap.id.toString() !== beatmapId) {
      window.history.replaceState(
        null,
        "",
        `/beatmapsets/${beatmapSetId}/${activeBeatmap.id}?${
          searchParams.toString()}`,
      );
    }
  }, [activeBeatmap, beatmapId, beatmapSetId, searchParams]);

  if (beatmapsetQuery.isLoading || !activeMode) {
    return (
      <div className="flex flex-col space-y-4">
        <BeatmapsetDetailSkeleton />
      </div>
    );
  }

  const errorMessage
    = beatmapsetQuery?.error?.message ?? t("error.notFound.title");

  const gamerule = gameModeToGamerule(activeMode);
  const vanilla = gameModeToVanilla(activeMode);
  const modeEntries = Object.entries(GameRulesGameModes[gamerule] ?? {});
  const ruleEntries = Object.entries(GameRuleFlags[vanilla] ?? {});

  const hasStandardMode = beatmapSet?.beatmaps.some(b => b.mode === GameMode.STANDARD) ?? false;
  const isModeEnabled = (mode: GameMode | null): boolean => {
    if (mode === null)
      return false;
    if (hasStandardMode)
      return true;
    return beatmapSet?.beatmaps.some(b => b.mode === gameModeToVanilla(mode)) ?? false;
  };

  return (
    <div className="flex flex-col space-y-4">
      <FilterPanel>
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <span
              className="flex items-center gap-2 whitespace-nowrap text-[13px] font-medium text-muted-foreground"
              style={{ animation: "fade-in 300ms ease-out 200ms backwards" }}
            >
              <Music2 className="size-4" />
              {t("header")}
            </span>
            <div className="flex flex-wrap gap-1">
              {modeEntries.map(([label, mode], i) => (
                <FilterOption
                  key={label}
                  label={label}
                  active={activeMode === mode}
                  disabled={!isModeEnabled(mode)}
                  onClick={() => mode != null && setActiveMode(mode)}
                  index={i}
                />
              ))}
            </div>
          </div>
        </div>
      </FilterPanel>

      <RoundedContent className="h-full rounded-lg p-0">
        {beatmapSet && activeBeatmap ? (
          <div className="duration-300 animate-in fade-in">
            <div>
              <div className="relative z-20 flex h-full min-h-48 md:min-h-64 lg:min-h-80">
                <div className="flex flex-grow rounded-t-lg p-3 md:p-4 lg:px-6">
                  <div className="flex flex-grow flex-col justify-end space-y-4 lg:mb-4 lg:flex-row lg:justify-between lg:space-y-0">
                    <div className="flex flex-col justify-between space-y-3 lg:space-y-0" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.7)" }}>
                      <div className="hero-animate">
                        <DifficultySelector
                          beatmapset={beatmapSet}
                          activeDifficulty={activeBeatmap}
                          setDifficulty={setActiveBeatmap}
                          activeGameMode={gameModeToVanilla(activeMode)}
                          difficulties={beatmapSet.beatmaps.filter(beatmap =>
                            [
                              gameModeToVanilla(activeMode),
                              GameMode.STANDARD,
                            ].includes(beatmap.mode),
                          )}
                        />
                      </div>

                      <div className="hero-animate hero-animate-delay-1">
                        <h3 className="text-2xl font-bold md:text-3xl">
                          <Link
                            href={makeBeatmapSearchUrl("title", beatmapSet.title)}
                            className="text-white transition-colors duration-150 hover:text-primary"
                          >
                            {beatmapSet.title}
                          </Link>
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg">
                            <Link
                              href={makeBeatmapSearchUrl("artist", beatmapSet.artist)}
                              className="text-foreground/80 transition-colors duration-150 hover:text-primary"
                            >
                              {beatmapSet.artist}
                            </Link>
                          </p>
                          <span
                            className="rounded-full px-2.5 py-0.5 text-xs font-extrabold uppercase transition-colors duration-300 lg:hidden"
                            style={(() => {
                              const pill = getStatusPillStyle(activeBeatmap.status);
                              return { backgroundColor: pill.bg, color: pill.color, textShadow: "none" };
                            })()}
                          >
                            {activeBeatmap.status}
                          </span>
                        </div>
                      </div>

                      <div className="hero-animate hero-animate-delay-2 flex flex-col space-y-2 text-white">
                        <div className="flex flex-row items-center">
                          <ImageWithFallback
                            src={`https://a.ppy.sh/${beatmapSet.creator_id}`}
                            alt=""
                            width={48}
                            height={48}
                            className="max-h-12 max-w-12 rounded-lg bg-muted object-contain"
                            fallBackSrc="/images/placeholder.png"
                          />
                          <div className="ml-2 flex flex-col text-xs font-light">
                            <div className="flex items-center">
                              {t("submission.submittedBy")}
&nbsp;
                              <p className="font-bold">
                                {beatmapSet.creator || "Unknown"}
                              </p>
                            </div>
                            <div className="flex items-center">
                              {t("submission.submittedOn")}
&nbsp;
                              <PrettyDate
                                time={beatmapSet.submitted_date}
                                className="font-bold"
                              />
                            </div>
                            {beatmapSet.ranked_date
                              && beatmapSet.status === BeatmapStatusWeb.RANKED && (
                              <div className="flex items-center">
                                {t("submission.rankedOn")}
&nbsp;
                                <PrettyDate
                                  time={beatmapSet.ranked_date}
                                  className="font-bold"
                                />
                              </div>
                            )}
                            {activeBeatmap.beatmap_nominator_user && (
                              <div className="flex w-full items-center gap-1">
                                <div className="lowercase text-current">
                                  {t("submission.statusBy", {
                                    status: activeBeatmap.status,
                                  })}
                                  {" "}
                                </div>
                                <BeatmapNominatorUser
                                  user={activeBeatmap.beatmap_nominator_user}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-row flex-wrap items-center gap-2" style={{ textShadow: "none" }}>
                          <FavouriteButton beatmapSet={beatmapSet} />
                          <DownloadButtons beatmapSet={beatmapSet} />
                          <BeatmapDropdown
                            activeMode={activeMode}
                            beatmap={activeBeatmap}
                            beatmapSet={beatmapSet}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full flex-col justify-between space-y-4 lg:w-auto lg:min-w-64 lg:space-y-0">
                      <div className="hidden flex-row items-center justify-end space-x-2 lg:flex">
                        {beatmapSet.video && (
                          <div className="flex items-center rounded-lg bg-background/60 p-2">
                            <Tooltip content={t("video.tooltip")}>
                              <Clapperboard className="h-5" />
                            </Tooltip>
                          </div>
                        )}
                        <span
                          className="rounded-full px-3 py-1 text-sm font-extrabold uppercase transition-colors duration-300"
                          style={(() => {
                            const pill = getStatusPillStyle(activeBeatmap.status);
                            return { backgroundColor: pill.bg, color: pill.color };
                          })()}
                        >
                          {activeBeatmap.status}
                        </span>
                      </div>
                      <DifficultyInformation
                        beatmap={activeBeatmap}
                        activeMode={gameModeToVanilla(activeMode)}
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 -z-10 overflow-hidden rounded-t-lg">
                  <ImageWithFallback
                    src={`https://assets.ppy.sh/beatmaps/${beatmapSet.id}/covers/cover@2x.jpg`}
                    alt="beatmap image"
                    fill={true}
                    sizes="100vw"
                    className="relative object-cover"
                    fallBackSrc="/images/unknown-beatmap-banner.jpg"
                    fadeIn
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
                </div>
              </div>
            </div>

            <div className="space-y-4 bg-card p-4">
              <div className="hero-animate hero-animate-delay-3 grid grid-cols-1 gap-4 lg:grid-cols-5">
                <div className="flex flex-col lg:col-span-3 lg:h-80">
                  <div className="flex h-full flex-col overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md">
                    <div className="flex items-center gap-2 border-b border-border/30 px-4 py-2.5">
                      <Book className="size-4 text-muted-foreground" />
                      <h3 className="text-[13px] font-medium text-muted-foreground">{t("description.header")}</h3>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto p-4">
                      <BBCodeReactParser textHtml={beatmapSet.description} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:col-span-2 lg:h-80">
                  <BeatmapInfoAccordion
                    beatmapSet={beatmapSet}
                    beatmap={activeBeatmap}
                  />
                </div>
              </div>

              {activeBeatmap.is_scoreable && (
                <div className="flex w-full flex-col space-y-4">
                  <FilterPanel>
                    <div className="px-4 py-3">
                      <div className="grid gap-x-4 gap-y-2.5 md:grid-cols-[auto_1fr]">
                        <span
                          className="self-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50"
                          style={{ animation: "fade-in 300ms ease-out 200ms backwards" }}
                        >
                          {t("leaderboardFilters.modeLabel")}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {modeEntries.map(([label, mode], i) => (
                            <FilterOption
                              key={label}
                              label={label}
                              active={activeMode === mode}
                              disabled={!isModeEnabled(mode)}
                              onClick={() => mode != null && setActiveMode(mode)}
                              index={i}
                              icon={mode != null ? <GameModeIcon mode={mode} /> : undefined}
                            />
                          ))}
                        </div>

                        <span
                          className="self-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/50"
                          style={{ animation: `fade-in 300ms ease-out ${200 + modeEntries.length * 50}ms backwards` }}
                        >
                          {t("leaderboardFilters.ruleLabel")}
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {ruleEntries.map(([label, mode], i) => (
                            <FilterOption
                              key={label}
                              label={label}
                              active={mode != null && gameModeToGamerule(activeMode) === gameModeToGamerule(mode)}
                              disabled={mode === null}
                              onClick={() => mode != null && setActiveMode(mode)}
                              index={modeEntries.length + i}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </FilterPanel>

                  <BeatmapLeaderboard
                    beatmap={activeBeatmap}
                    mode={activeMode}
                  />
                </div>
              )}
            </div>
          </div>
        ) : beatmapsetQuery?.error
          ? (
              <RoundedContent className="flex flex-col items-center justify-between gap-8 rounded-l md:flex-row md:items-start ">
                <div className="flex flex-col space-y-2">
                  <h1 className="text-4xl">{errorMessage}</h1>
                  <p className="text-muted-foreground">
                    {t("error.notFound.description")}
                  </p>
                </div>
                <Image
                  src="/images/user-not-found.png"
                  alt="404"
                  width={200}
                  height={400}
                  className="max-w-fit"
                />
              </RoundedContent>
            )
          : null}
      </RoundedContent>
    </div>
  );
}
