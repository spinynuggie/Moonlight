"use client";

import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";

import type { ProfileUserResponse } from "@/lib/hooks/api/user/useUserProfile";
import { timeSince } from "@/lib/utils/timeSince";

interface ProfileAccountStandingSectionProps {
  user: ProfileUserResponse;
}

export function ProfileAccountStandingSection({
  user,
}: ProfileAccountStandingSectionProps) {
  const isSilenced = Boolean(user.silenced_until && new Date(user.silenced_until).getTime() > Date.now());
  const hasStandingIssues = Boolean(user.restricted || isSilenced);

  if (!hasStandingIssues) {
    return (
      <div className="rounded-[14px] border border-emerald-500/30 bg-emerald-500/10 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 text-emerald-400" />
          <div>
            <p className="text-sm font-semibold text-foreground">Good standing</p>
            <p className="mt-1 text-sm text-muted-foreground">
              This account currently has no visible standing issues.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {user.restricted && (
        <div className="rounded-[14px] border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 size-5 text-amber-400" />
            <div>
              <p className="text-sm font-semibold text-foreground">Restricted account</p>
              <p className="mt-1 text-sm text-muted-foreground">
                This user is currently restricted.
              </p>
            </div>
          </div>
        </div>
      )}

      {isSilenced && user.silenced_until && (
        <div className="rounded-[14px] border border-destructive/30 bg-destructive/10 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 text-destructive" />
            <div>
              <p className="text-sm font-semibold text-foreground">Silenced</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Silence expires {timeSince(user.silenced_until)}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
