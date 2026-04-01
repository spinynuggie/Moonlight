import { Activity, AlertCircle, BarChart3, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useServerStatus } from "@/lib/hooks/api/useServerStatus";
import { cn } from "@/lib/utils";

const statCards = [
  {
    key: "total_users",
    title: "Total Users",
    icon: Users,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    key: "users_online",
    title: "Users Online",
    icon: Activity,
    iconBg: "bg-[#8C977D]/10",
    iconColor: "text-[#8C977D]",
  },
  {
    key: "restrictions",
    title: "Restrictions",
    icon: AlertCircle,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
  },
  {
    key: "total_scores",
    title: "Total Scores",
    icon: BarChart3,
    iconBg: "bg-yellow-pastel/10",
    iconColor: "text-yellow-pastel",
  },
] as const;

export function ServerStatusCards() {
  const serverStatusQuery = useServerStatus();
  const serverStatus = serverStatusQuery.data;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, i) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.key}
            className="rounded-[10px] border-border/50 shadow-md transition-colors duration-150 animate-in fade-in hover:bg-secondary/30"
            style={{ animationDelay: `${i * 75}ms`, animationFillMode: "backwards" }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={cn("flex size-8 items-center justify-center rounded-lg", card.iconBg)}>
                <Icon className={cn("size-4", card.iconColor)} />
              </div>
            </CardHeader>
            <CardContent>
              {card.key === "total_users" && (
                serverStatus
                  ? (
                      <div className="text-2xl font-bold">
                        {serverStatus.total_users.toLocaleString()}
                      </div>
                    )
                  : (
                      <Skeleton className="h-8 w-24" />
                    )
              )}
              {card.key === "users_online" && (
                serverStatus
                  ? (
                      <>
                        <div className="text-2xl font-bold">
                          {serverStatus.users_online.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {(
                            (serverStatus.users_online / serverStatus.total_users)
                            * 100
                          ).toFixed(2)}
                          % of total users
                        </p>
                      </>
                    )
                  : (
                      <div>
                        <Skeleton className="mb-1 h-8 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    )
              )}
              {card.key === "restrictions" && (
                serverStatus
                  ? (
                      <>
                        <div className="text-2xl font-bold">
                          {serverStatus.total_restrictions?.toLocaleString() || "N/A"}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {(
                            ((serverStatus.total_restrictions || 0)
                              / serverStatus.total_users)
                            * 100
                          ).toFixed(2)}
                          % of users
                        </p>
                      </>
                    )
                  : (
                      <div>
                        <Skeleton className="mb-1 h-8 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    )
              )}
              {card.key === "total_scores" && (
                serverStatus
                  ? (
                      <div className="text-2xl font-bold">
                        {serverStatus.total_scores?.toLocaleString() || "N/A"}
                      </div>
                    )
                  : (
                      <Skeleton className="h-8 w-24" />
                    )
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
