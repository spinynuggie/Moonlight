import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { getT } from "@/lib/i18n/utils";
import fetcher from "@/lib/services/fetcher";
import type { UserResponse } from "@/lib/types/api";

export const revalidate = 60;

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await fetcher<UserResponse>(`user/${id}`);

  if (!user) {
    notFound();
  }

  const t = await getT("pages.user.meta");

  return {
    title: t("title", { username: user.username }),
    description: t("description", { username: user.username }),
    openGraph: {
      siteName: "osu!sunrise",
      title: t("title", { username: user.username }),
      description: t("description", { username: user.username }),
      images: [
        `https://a.${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/avatar/${user.user_id}`,
      ],
    },
  };
}

export default function UserLayout({ children }: LayoutProps) {
  return children;
}
