import "./globals.css";
import "./style.css";

import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import localFont from "next/font/local";
import { getLocale, getMessages } from "next-intl/server";

import Providers from "@/components/Providers";
import ScrollUp from "@/components/ScrollUp";
import ScrollUpButton from "@/components/ScrollUpButton";
import { getT } from "@/lib/i18n/utils";

const font = localFont({
  src: [
    { path: "../public/fonts/Torus-Thin.otf", weight: "100", style: "normal" },
    { path: "../public/fonts/Torus-Light.otf", weight: "300", style: "normal" },
    { path: "../public/fonts/Torus-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/Torus-SemiBold.otf", weight: "600", style: "normal" },
    { path: "../public/fonts/Torus-Bold.otf", weight: "700", style: "normal" },
    { path: "../public/fonts/Torus-Heavy.otf", weight: "900", style: "normal" },
  ],
  fallback: ["Noto Sans", "sans-serif"],
  display: "swap",
});

const _fallbackFont = Noto_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "cyrillic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT("components.rootLayout.meta");
  return {
    title: t("title"),
    twitter: {
      card: "summary",
    },
    description: t("description"),
    openGraph: {
      siteName: t("title"),
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: `https://${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/images/metadata.png`,
          width: 800,
          height: 800,
          alt: "osu!sunrise Logo",
        },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);

  return (
    <html
      lang={locale}
      className={`dark ${font.className}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-background font-normal text-current">
        <Providers locale={locale} messages={messages}>
          {children}
          <ScrollUp />
        </Providers>
        <ScrollUpButton />
      </body>
    </html>
  );
}
