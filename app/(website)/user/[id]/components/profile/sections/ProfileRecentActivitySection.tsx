"use client";

import { Clock3 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useUserProfileActivity } from "@/lib/hooks/api/user/useUserProfile";
import { cn } from "@/lib/utils";
import { timeSince } from "@/lib/utils/timeSince";

interface ProfileRecentActivitySectionProps {
  userId: number;
}

export function ProfileRecentActivitySection({
  userId,
}: ProfileRecentActivitySectionProps) {
  const activityQuery = useUserProfileActivity(userId, 5);
  const events = activityQuery.data?.flatMap(page => page.events) ?? [];
  const totalCount = activityQuery.data?.find(page => page.total_count !== undefined)?.total_count ?? 0;
  const canLoadMore = events.length < totalCount;

  if (!activityQuery.data && activityQuery.isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="h-14 rounded-[14px] border border-border/40 bg-secondary/40"
          />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-[14px] border border-dashed border-border/50 bg-secondary/30 text-sm text-muted-foreground">
        No recent profile activity yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => {
        const content = event.message ?? event.title ?? humanizeActivityType(event.type);

        return (
          <div
            key={event.id}
            className="flex items-start justify-between gap-4 rounded-[14px] border border-border/40 bg-secondary/35 px-4 py-3"
          >
            <div className="min-w-0">
              <div className="flex items-start gap-3">
                <span className={cn(
                  "mt-1 inline-flex size-2.5 shrink-0 rounded-full bg-primary",
                  event.grade && "bg-emerald-400",
                  event.medal_id && "bg-amber-400",
                )}
                />
                <div className="min-w-0">
                  {event.url
                    ? (
                        <Link href={event.url} className="text-sm font-medium text-foreground hover:text-primary">
                          {content}
                        </Link>
                      )
                    : (
                        <p className="text-sm font-medium text-foreground">
                          {content}
                        </p>
                      )}

                  {(event.beatmap_title || event.medal_name) && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {event.beatmap_title ?? event.medal_name}
                      {event.beatmap_version ? ` [${event.beatmap_version}]` : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
              <Clock3 className="size-3.5" />
              <span>{timeSince(event.created_at)}</span>
            </div>
          </div>
        );
      })}

      {canLoadMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="secondary"
            onClick={() => activityQuery.setSize(activityQuery.size + 1)}
          >
            Show More
          </Button>
        </div>
      )}
    </div>
  );
}

function humanizeActivityType(type: string) {
  return type
    .replaceAll(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll(/[_-]/g, " ")
    .trim();
}
