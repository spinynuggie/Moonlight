import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

interface RoundedContentProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

export default function RoundedContent({
  children,
  className,
  style,
}: RoundedContentProps) {
  return (
    <div
      className={cn(
        "h-fit max-h-fit min-h-fit rounded-b-lg border bg-accent p-4 shadow-md",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
