"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

import RoundedContent from "@/components/General/RoundedContent";
import { Button } from "@/components/ui/button";

export default function NewsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RoundedContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <AlertCircle className="size-10 text-muted-foreground" />
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">
          Failed to load this page. Please try again.
        </p>
      </div>
      <pre className="max-w-full overflow-auto rounded bg-secondary p-3 text-left text-xs text-muted-foreground">
        {error.message}
        {error.digest && `\nDigest: ${error.digest}`}
      </pre>
      <Button variant="outline" size="sm" onClick={reset}>
        <RefreshCw className="mr-2 size-4" />
        Try again
      </Button>
    </RoundedContent>
  );
}
