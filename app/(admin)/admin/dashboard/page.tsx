"use client";

import { BeatmapSetsEvents } from "@/app/(admin)/admin/beatmapsets/components/BeatmapSetsEvents";
import { ServerStatusCards } from "@/app/(admin)/admin/dashboard/components/serverStatusCards";
import { UserListItemSkeleton } from "@/components/Skeletons/Users/UserListItemSkeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserListItem } from "@/components/UserListElement";
import { WorkInProgress } from "@/components/WorkInProgress";
import { useServerStatus } from "@/lib/hooks/api/useServerStatus";

export default function Page() {
  const serverStatusQuery = useServerStatus();
  const serverStatus = serverStatusQuery.data;

  return (
    <div className="space-y-4">
      <ServerStatusCards />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>New Users</CardTitle>
            <CardDescription>Latest registered users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {serverStatus?.recent_users
              ? serverStatus.recent_users.map((user, i) => (
                  <div
                    key={`recent-user-${user.user_id}`}
                    className="duration-300 animate-in fade-in"
                    style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
                  >
                    <UserListItem
                      user={user}
                      includeFriendshipButton={false}
                    />
                  </div>
                ))
              : Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={`user-skeleton-${i}`}
                    className="duration-300 animate-in fade-in"
                    style={{ animationDelay: `${Math.min(i * 75, 600)}ms`, animationFillMode: "backwards" }}
                  >
                    <UserListItemSkeleton />
                  </div>
                ))}
          </CardContent>
        </Card>
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Scores</CardTitle>
            <CardDescription>Latests submitted users scores</CardDescription>
          </CardHeader>
          <CardContent>
            <WorkInProgress />
          </CardContent>
        </Card>
        <Card className="md:col-span-2 lg:col-span-6">
          <CardHeader>
            <CardTitle>Recent Beatmap Status Events</CardTitle>
            <CardDescription>Latests changes with beatmaps</CardDescription>
          </CardHeader>
          <CardContent>
            <BeatmapSetsEvents />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
