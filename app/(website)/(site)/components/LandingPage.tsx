"use client";

import { useEffect, useState } from "react";

import LandingConnectGuide from "@/app/(website)/(site)/components/LandingConnectGuide";
import LandingHero from "@/app/(website)/(site)/components/LandingHero";
import LandingNews from "@/app/(website)/(site)/components/LandingNews";
import ServerMaintenanceDialog from "@/components/ServerMaintenanceDialog";
import { useServerStatus } from "@/lib/hooks/api/useServerStatus";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

export default function LandingPage() {
  const [isMaintenanceDialogOpen, setMaintenanceDialogOpen] = useState<
    boolean | null
  >(null);

  const { data: serverStatus } = useServerStatus();

  useEffect(() => {
    if (serverStatus?.is_on_maintenance && isMaintenanceDialogOpen == null) {
      setMaintenanceDialogOpen(true);
    }
  }, [serverStatus?.is_on_maintenance, isMaintenanceDialogOpen]);

  useScrollReveal([]);

  return (
    <div className="w-full space-y-5">
      <LandingHero />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="scroll-reveal lg:col-span-2">
          <LandingNews />
        </div>
        <aside className="scroll-reveal lg:col-span-1">
          <LandingConnectGuide />
        </aside>
      </div>

      <ServerMaintenanceDialog
        open={!!isMaintenanceDialogOpen}
        setOpen={setMaintenanceDialogOpen}
      />
    </div>
  );
}
