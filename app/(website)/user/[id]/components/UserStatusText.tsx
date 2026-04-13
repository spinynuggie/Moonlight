import { dateToPrettyString } from "@/components/General/PrettyDate";
import { Tooltip } from "@/components/Tooltip";
import { useT } from "@/lib/i18n/utils";
import type { UserResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { getStatusColor } from "@/lib/utils/getStatusColor";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  user: UserResponse;
  asChild?: boolean;
  disabled?: boolean;
}

export default function UserStatusText({
  user,
  asChild,
  disabled,
  ...props
}: Props) {
  const t = useT("pages.user.components.statusText");
  const isOffline = user.user_status === "Offline";

  const tooltipContent = (
    <p className="break-all text-sm text-foreground">
      {isOffline ? (
        <>
          <span className="font-medium">{user.user_status}</span>
          {" "}
          <span className="text-muted-foreground">
            {t("lastSeenOn", {
              date: dateToPrettyString(user.last_online_time),
            })}
          </span>
        </>
      ) : (
        user.user_status
      )}
    </p>
  );

  return (
    <Tooltip
      className="flex min-w-0 flex-grow"
      content={tooltipContent}
      align="start"
      asChild={asChild}
      disabled={disabled}
    >
      <div
        {...props}
        className={cn(
          "flex min-w-0 flex-grow items-center text-sm leading-tight transition-colors duration-200",
          getStatusColor(user.user_status),
          props.className,
        )}
      >
        <p className="truncate">
          {isOffline ? (
            <>
              <span className="font-medium">{user.user_status}</span>
              <span className="ml-1 text-xs text-muted-foreground">
                • {dateToPrettyString(user.last_online_time)}
              </span>
            </>
          ) : (
            <span className="font-medium">{user.user_status}</span>
          )}
        </p>
      </div>
    </Tooltip>
  );
}
