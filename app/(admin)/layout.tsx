import type { Metadata } from "next";

import { AppSidebar } from "@/app/(admin)/components/AppSidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import ScrollUp from "@/components/ScrollUp";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Admin Panel | osu!sunrise",
  openGraph: {
    title: "Admin Panel | osu!sunrise",
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/50 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="[&_nav]:mb-0">
            <Breadcrumbs />
          </div>
        </header>

        <div className="mx-auto w-full max-w-7xl p-4 md:p-6">
          {children}
        </div>

        <ScrollUp />
      </SidebarInset>
    </SidebarProvider>
  );
}
