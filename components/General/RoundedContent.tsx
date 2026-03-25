import { cn } from "@/lib/utils";

interface RoundedContentProps {
  children: React.ReactNode;
  className?: string;
}

export default function RoundedContent({
  children,
  className,
}: RoundedContentProps) {
  return (
    <div
      className={cn(
        "h-fit max-h-fit min-h-fit rounded-b-lg border bg-accent p-4 shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
