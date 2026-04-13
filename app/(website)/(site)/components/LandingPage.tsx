"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import LandingHero from "@/app/(website)/(site)/components/LandingHero";
import ServerMaintenanceDialog from "@/components/ServerMaintenanceDialog";
import { useServerStatus } from "@/lib/hooks/api/useServerStatus";

const LandingConnectGuide = dynamic(() => import("@/app/(website)/(site)/components/LandingConnectGuide"), { ssr: false });
const LandingNews = dynamic(() => import("@/app/(website)/(site)/components/LandingNews"), { ssr: false });

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

      <LandingConnectGuide />

      <LandingNews />

      <ServerMaintenanceDialog
        open={!!isMaintenanceDialogOpen}
        setOpen={setMaintenanceDialogOpen}
      />
    </div>
  );
}
