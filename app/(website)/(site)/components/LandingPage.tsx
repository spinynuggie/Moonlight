"use client";

import { useEffect, useState } from "react";

import LandingConnectGuide from "@/app/(website)/(site)/components/LandingConnectGuide";
import LandingHero from "@/app/(website)/(site)/components/LandingHero";
import LandingNews from "@/app/(website)/(site)/components/LandingNews";
import ServerMaintenanceDialog from "@/components/ServerMaintenanceDialog";
import { useServerStatus } from "@/lib/hooks/api/useServerStatus";

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

  return (
    <div className="w-full">
      <LandingHero />

      <div className="mx-auto max-w-3xl">
        <LandingConnectGuide />
      </div>

      <div className="my-8 h-px bg-gradient-to-r from-transparent via-border/60 to-transparent sm:my-12" />

      <LandingNews />

      <ServerMaintenanceDialog
        open={!!isMaintenanceDialogOpen}
        setOpen={setMaintenanceDialogOpen}
      />
    </div>
  );
}
