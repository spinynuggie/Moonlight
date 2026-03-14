import { ChevronDown } from "lucide-react";

import { BeatmapSetEvent } from "@/app/(admin)/admin/beatmapsets/components/BeatmapSetEvent";
import { BeatmapSetEventSkeleton } from "@/components/Skeletons/Beatmaps/BeatmapSetEventSkeleton";
import { Button } from "@/components/ui/button";
import { useBeatmapsSetEvents } from "@/lib/hooks/api/beatmap/useBeatmapSetsEvents";

export function BeatmapSetsEvents() {
  const { data, setSize, size, isLoading } = useBeatmapsSetEvents(5);

  const events = data?.flatMap(item => item.events);
  const totalCount
    = data?.find(item => item.total_count !== undefined)?.total_count ?? 0;

  const isLoadingMore
    = isLoading || (size > 0 && data && data[size - 1] === undefined);

  const handleShowMore = () => {
    setSize(size + 1);
  };

  return (
    <div className="flex flex-col gap-2">
      {isLoading && (!events || events.length === 0)
        ? Array.from({ length: 5 }, (_, i) => (
            <div
              key={`event-skeleton-${i}`}
              className="duration-300 animate-in fade-in"
              style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
            >
              <BeatmapSetEventSkeleton />
            </div>
          ))
        : events?.map((event, i) => (
            <div
              key={`beatmap-set-event-${event.event_id}`}
              className="duration-300 animate-in fade-in"
              style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
            >
              <BeatmapSetEvent event={event} />
            </div>
          ))}
      {events && events?.length < totalCount && (
        <div className="mt-4 flex justify-center">
          <Button
            onClick={handleShowMore}
            className="flex w-full items-center justify-center md:w-1/2"
            isLoading={isLoadingMore}
            variant="secondary"
          >
            <ChevronDown />
            Show more
          </Button>
        </div>
      )}
    </div>
  );
}
