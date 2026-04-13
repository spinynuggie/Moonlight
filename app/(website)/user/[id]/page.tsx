import { notFound } from "next/navigation";

import ProfilePageClient from "@/app/(website)/user/[id]/components/profile/ProfilePageClient";

type UserPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    mode?: string | string[];
    tab?: string | string[];
  }>;
};

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value ?? null;
}

export default async function UserPage({
  params,
  searchParams,
}: UserPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const userId = Number(id);

  if (!Number.isFinite(userId)) {
    notFound();
  }

  return (
    <ProfilePageClient
      userId={userId}
      legacyMode={getSingleValue(query.mode)}
      legacyTab={getSingleValue(query.tab)}
    />
  );
}
