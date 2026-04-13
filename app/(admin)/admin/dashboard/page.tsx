"use client";

import { AnimatePresence, motion } from "framer-motion";

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
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

export default function Page() {
  const serverStatusQuery = useServerStatus();
  const serverStatus = serverStatusQuery.data;

  useScrollReveal([serverStatus]);

  const usersFingerprint = serverStatus?.recent_users
    ?.map(u => u.user_id)
    .join("-") ?? "loading";

  return (
    <div className="space-y-4">
      <ServerStatusCards />

      <div className="scroll-reveal grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="rounded-[10px] border-border/50 shadow-md lg:col-span-3">
          <CardHeader>
            <CardTitle>New Users</CardTitle>
            <CardDescription>Latest registered users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={usersFingerprint}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-2"
              >
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
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] border-border/50 shadow-md lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Scores</CardTitle>
            <CardDescription>Latests submitted users scores</CardDescription>
          </CardHeader>
          <CardContent>
            <WorkInProgress />
          </CardContent>
        </Card>
      </div>

      <div className="scroll-reveal">
        <Card className="rounded-[10px] border-border/50 shadow-md md:col-span-2 lg:col-span-6">
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
