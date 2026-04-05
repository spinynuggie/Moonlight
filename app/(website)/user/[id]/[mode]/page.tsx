import { notFound } from "next/navigation";

import ProfilePageClient from "@/app/(website)/user/[id]/components/profile/ProfilePageClient";
import { isProfileModeSegment } from "@/app/(website)/user/[id]/components/profile/profileRouting";

type UserModePageProps = {
  params: Promise<{ id: string; mode: string }>;
  searchParams: Promise<{
    mode?: string | string[];
    tab?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? null;
}

export default async function UserModePage({
  params,
  searchParams,
}: UserModePageProps) {
  const { id, mode } = await params;
  const query = await searchParams;
  const userId = Number(id);

  if (!Number.isFinite(userId) || !isProfileModeSegment(mode)) {
    notFound();
  }

  return (
    <ProfilePageClient
      userId={userId}
      routeMode={mode}
      legacyMode={getSingleValue(query.mode)}
      legacyTab={getSingleValue(query.tab)}
    />
  );
}
