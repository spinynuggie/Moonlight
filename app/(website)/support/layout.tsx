import type { Metadata } from "next";

import { getT } from "@/lib/i18n/utils";

import Page from "./page";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT("pages.support.meta");
  const description = t("description");
  return {
    title: t("title"),
    description,
    openGraph: {
      title: t("title"),
      description,
    },
  };
}

export default Page;
