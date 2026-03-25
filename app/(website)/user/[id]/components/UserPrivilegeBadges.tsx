import {
  Badge as BadgeIcon,
  BotIcon,
  Coffee,
  HeartHandshake,
  Music,
  Shield,
  Star,
} from "lucide-react";
import * as React from "react";
import { useMemo } from "react";

import { Tooltip } from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/lib/i18n/utils";
import { UserBadge } from "@/lib/types/api";
import { cn } from "@/lib/utils";

interface UserPrivilegeBadgesProps {
  badges: UserBadge[];
  small?: boolean;
  className?: string;
  withToolTip?: boolean;
}

const badgeMap = {
  [UserBadge.DEVELOPER]: {
    icon: <Coffee className="size-4 md:size-6" />,
    color:
      "bg-border hover:bg-primary/30 text-primary border-border",
  },
  [UserBadge.BAT]: {
    icon: <Music className="size-4 md:size-6" />,
    color:
      "bg-border hover:bg-primary/30 text-primary border-border",
  },
  [UserBadge.BOT]: {
    icon: <BotIcon className="size-4 md:size-6" />,
    color:
      "bg-border hover:bg-primary/30 text-primary border-border",
  },
  [UserBadge.ADMIN]: {
    icon: <Shield className="size-4 md:size-6" />,
    color: "bg-border hover:bg-primary/30 text-primary border-border",
  },
  [UserBadge.SUPPORTER]: {
    icon: <HeartHandshake className="size-4 md:size-6" />,
    color: "bg-border hover:bg-primary/30 text-primary border-border",
  },
  [UserBadge.ASTERIA]: {
    icon: <Star className="size-4 md:size-6" />,
    color: "bg-border hover:bg-primary/30 text-primary border-border",
  },
};

export default function UserPrivilegeBadges({
  badges,
  small,
  className,
  withToolTip = true,
}: UserPrivilegeBadgesProps) {
  const t = useT("pages.user.components.privilegeBadges");

  const badgeNames = useMemo(
    () => ({
      [UserBadge.DEVELOPER]: t("badges.Developer"),
      [UserBadge.ADMIN]: t("badges.Admin"),
      [UserBadge.BAT]: t("badges.Bat"),
      [UserBadge.BOT]: t("badges.Bot"),
      [UserBadge.SUPPORTER]: t("badges.Supporter"),
      [UserBadge.ASTERIA]: t("badges.Asteria"),
    }),
    [t],
  );

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {badges.map((badge) => {
        // eslint-disable-next-line prefer-const -- the icon variable is reassigned
        let { icon, color } = badgeMap[badge] || {
          icon: <BadgeIcon className="size-4 md:size-6 " />,
          color:
            "bg-slate-600/30 hover:bg-slate-500/30 text-slate-400 border-slate-600",
          description: "",
        };

        if (small) {
          // eslint-disable-next-line @eslint-react/no-clone-element -- fine with us
          icon = React.cloneElement(icon, {
            className: "w-4 h-4",
          });
        }

        const badgeName = badgeNames[badge] || badge;

        return (
          <Tooltip
            content={<p className="capitalize">{badgeName}</p>}
            key={`user-badge-${badge}`}
            disabled={!withToolTip}
          >
            <div className="rounded-lg bg-card/50">
              <Badge
                className={cn(
                  `flex items-center rounded-lg p-1 text-xs text-white ${color} smooth-transition`,
                  !small ? "gap-1 md:gap-2 md:p-1.5 md:text-base" : "",
                  withToolTip ? "hover:scale-105" : "",
                )}
              >
                {icon}
              </Badge>
            </div>
          </Tooltip>
        );
      })}
    </div>
  );
}
