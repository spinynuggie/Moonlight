import { cn } from "@/lib/utils";

interface PrettyHeaderProps {
  icon?: React.ReactNode;
  text?: string;
  roundBottom?: boolean;
  children?: React.ReactNode;
  className?: string;
  counter?: number;
}

export default function PrettyHeader({
  children,
  icon,
  text,
  className,
  roundBottom = false,
  counter,
}: PrettyHeaderProps) {
  return (
    <div
      className={cn(
        `flex items-center rounded-t-lg border bg-card p-4 shadow`,
        children ? "place-content-between" : "",
        roundBottom ? "rounded-b-lg" : "",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center",
          !icon && !text && !counter ? "hidden" : "",
        )}
      >
        {icon && <div className="text-current/30 mr-2">{icon}</div>}
        <h2 className="text-lg font-semibold capitalize">{text}</h2>
        {counter && (
          <div className="text-current/30 ml-2 rounded-full bg-background px-2 py-1 text-xs">
            {counter}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
