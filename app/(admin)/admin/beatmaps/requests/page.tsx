"use client";

import { ChevronDown, ChevronsUp } from "lucide-react";
import { useState } from "react";

import BeatmapSetOverview from "@/app/(website)/user/[id]/components/BeatmapSetOverview";
import { BeatmapSetCard } from "@/components/Beatmaps/BeatmapSetCard";
import PrettyHeader from "@/components/General/PrettyHeader";
import { BeatmapSetCardSkeleton } from "@/components/Skeletons/Beatmaps/BeatmapSetCardSkeleton";
import { BeatmapSetOverviewSkeleton } from "@/components/Skeletons/Beatmaps/BeatmapSetOverviewSkeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBeatmapSetGetHypedSets } from "@/lib/hooks/api/beatmap/useBeatmapSetHypedSets";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

export default function Page() {
  const [viewMode, setViewMode] = useState("grid");

  const { data, setSize, size, isLoading } = useBeatmapSetGetHypedSets();

  const beatmapsets = data?.flatMap(item => item.sets);
  const totalCount
    = data?.find(item => item.total_count !== undefined)?.total_count ?? 0;

  const isLoadingMore
    = isLoading || (size > 0 && data && data[size - 1] === undefined);

  const handleShowMore = () => {
    setSize(size + 1);
  };

  useScrollReveal([beatmapsets]);

  return (
    <div className="flex w-full flex-col space-y-4">
      <PrettyHeader
        icon={<ChevronsUp />}
        text="Beatmap requests"
        roundBottom={true}
        className="rounded-[10px] border-border/50 shadow-md"
      />
      <div className="space-y-2">
        <div className="flex flex-row place-content-between items-center">
          <div className="flex items-center rounded-[10px] border border-border/50 bg-card px-3 py-1 text-sm font-medium shadow-md">
            Total requests: {totalCount}
          </div>
          <div className="flex items-center space-x-2">
            <Tabs
              defaultValue="grid"
              value={viewMode}
              onValueChange={setViewMode}
              className="h-9 "
            >
              <TabsList className="grid h-9 w-[120px] grid-cols-2 bg-card shadow">
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="scroll-reveal space-y-4">
          <Tabs value={viewMode}>
            <TabsContent value="grid" className="m-0">
              <div className="flex flex-wrap gap-[10px]">
                {beatmapsets?.map((beatmapSet, i) => (
                  <div
                    key={`beatmap-set-card-${beatmapSet.id}`}
                    className="w-full duration-300 animate-in fade-in md:w-[calc(50%-5px)]"
                    style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
                  >
                    <BeatmapSetCard beatmapSet={beatmapSet} />
                  </div>
                ))}
                {isLoading && (!beatmapsets || beatmapsets.length === 0) && (
                  Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="w-full duration-300 animate-in fade-in md:w-[calc(50%-5px)]"
                      style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
                    >
                      <BeatmapSetCardSkeleton />
                    </div>
                  ))
                )}
                {isLoadingMore && beatmapsets && beatmapsets.length > 0 && (
                  Array.from({ length: 4 }, (_, i) => (
                    <div
                      key={`loading-more-skeleton-${i}`}
                      className="w-full duration-300 animate-in fade-in md:w-[calc(50%-5px)]"
                      style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
                    >
                      <BeatmapSetCardSkeleton />
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="list" className="m-0">
              <Card className="rounded-[10px] border-border/50 p-4 shadow-md">
                <CardContent className="grid grid-cols-1 gap-4 p-0 sm:grid-cols-2">
                  {beatmapsets?.map((beatmapSet, i) => (
                    <div
                      key={`beatmap-set-overview-${beatmapSet.id}`}
                      className="duration-300 animate-in fade-in"
                      style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
                    >
                      <BeatmapSetOverview beatmapSet={beatmapSet} />
                    </div>
                  ))}
                  {isLoading && (!beatmapsets || beatmapsets.length === 0) && (
                    Array.from({ length: 8 }, (_, i) => (
                      <div
                        key={`list-skeleton-${i}`}
                        className="duration-300 animate-in fade-in"
                        style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
                      >
                        <BeatmapSetOverviewSkeleton />
                      </div>
                    ))
                  )}
                  {isLoadingMore && beatmapsets && beatmapsets.length > 0 && (
                    Array.from({ length: 4 }, (_, i) => (
                      <div
                        key={`list-loading-more-skeleton-${i}`}
                        className="duration-300 animate-in fade-in"
                        style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
                      >
                        <BeatmapSetOverviewSkeleton />
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          {beatmapsets && beatmapsets?.length < totalCount && (
            <div className="flex justify-center">
              <Button
                onClick={handleShowMore}
                isLoading={isLoadingMore}
                variant="secondary"
                className="flex w-full items-center justify-center gap-1.5 rounded-[10px] border border-border/50 py-2.5 shadow-md"
              >
                <ChevronDown className="size-4" />
                Show more
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
