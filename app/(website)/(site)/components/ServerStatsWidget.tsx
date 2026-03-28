"use client";

import { Activity, Trophy, Users } from "lucide-react";

import PrettyCounter from "@/components/General/PrettyCounter";
import { Skeleton } from "@/components/ui/skeleton";
import { useT } from "@/lib/i18n/utils";
import type { StatusResponse } from "@/lib/types/api";

interface ServerStatsWidgetProps {
  serverStatus?: StatusResponse;
}

export default function ServerStatsWidget({ serverStatus }: ServerStatsWidgetProps) {
  const t = useT("pages.mainPage.statuses");

  return (
    <div className="divide-y divide-border">
      <StatRow
        icon={<Activity className="size-3.5 text-[#8C977D]" />}
        label={t("usersOnline")}
        value={serverStatus?.users_online}
      />
      <StatRow
        icon={<Users className="size-3.5 text-primary" />}
        label={t("totalUsers")}
        value={serverStatus?.total_users}
      />
      <StatRow
        icon={<Trophy className="size-3.5 text-[#D9BC8C]" />}
        label={t("totalScores")}
        value={serverStatus?.total_scores ?? undefined}
      />
    </div>
  );
}

function StatRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: number;
}) {
  return (
    <div className="flex items-center gap-2.5 py-2.5">
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="ml-auto h-5 text-sm font-bold">
        {value !== undefined
          ? <PrettyCounter value={Number(value)} />
          : <Skeleton className="h-5 w-12" />}
      </div>
    </div>
  );
}
