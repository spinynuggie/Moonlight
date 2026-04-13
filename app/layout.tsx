import "./globals.css";
import "./style.css";

import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import { getLocale, getMessages } from "next-intl/server";
import NextTopLoader from "nextjs-toploader";

import Providers from "@/components/Providers";
import ScrollUp from "@/components/ScrollUp";
import ScrollUpButton from "@/components/ScrollUpButton";
import { getT } from "@/lib/i18n/utils";

const apiDomain = process.env.NEXT_PUBLIC_SERVER_DOMAIN;

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
    themeColor: "#8DA3B9",
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
  const [locale, messages, cookieStore] = await Promise.all([
    getLocale(),
    getMessages(),
    cookies(),
  ]);
  const initialHasAuthCookie = cookieStore.has("session_token")
    || cookieStore.has("refresh_token");

  return (
    <html
      lang={locale}
      className={`dark ${font.className}`}
      suppressHydrationWarning
    >
      <head>
        {apiDomain && (
          <>
            <link rel="preconnect" href={`https://api.${apiDomain}`} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={`https://api.${apiDomain}`} />
          </>
        )}
      </head>
      <body className="flex min-h-screen flex-col bg-background font-normal text-current">
        {/* Server-rendered preloader for instant LCP */}
        <div
          id="server-preloader"
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          style={{ willChange: "opacity" }}
        >
          <div
            data-preloader-bg=""
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, hsl(var(--primary) / 0.04) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage: "radial-gradient(circle 500px at center, black 0%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(circle 500px at center, black 0%, transparent 100%)",
            }}
          />
          <div data-preloader-content="" className="relative flex flex-col items-center gap-3 rounded-2xl px-20 py-12 backdrop-blur-xl">
            <div className="preloader-content-entry relative z-10">
              <h1
                className="pb-2 text-4xl font-bold tracking-tight sm:text-5xl"
                style={{
                  background: "linear-gradient(90deg, hsl(210 24% 64%), hsl(0 7% 89%), hsl(210 24% 64%))",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 20px rgba(141, 163, 185, 0.25)) drop-shadow(0 0 48px rgba(141, 163, 185, 0.08))",
                  animation: "preloader-gradient-morph 1s ease-in-out infinite 800ms",
                }}
              >
                himejoshi
              </h1>
            </div>
            <p
              className="preloader-content-entry relative z-10 text-sm font-medium text-muted-foreground"
              style={{
                filter: "drop-shadow(0 0 12px rgba(141, 163, 185, 0.15))",
                animationDelay: "100ms",
              }}
            >
              Yet another osu! server
            </p>
            <div className="preloader-content-entry relative z-10 flex gap-2" style={{ animationDelay: "200ms" }}>
              <div className="size-2 rounded-full bg-primary" style={{ animation: "preloader-dot-pulse 1s ease-in-out infinite", animationDelay: "200ms" }} />
              <div className="size-2 rounded-full bg-primary" style={{ animation: "preloader-dot-pulse 1s ease-in-out infinite", animationDelay: "400ms" }} />
              <div className="size-2 rounded-full bg-primary" style={{ animation: "preloader-dot-pulse 1s ease-in-out infinite", animationDelay: "600ms" }} />
            </div>
          </div>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=false;function dismiss(){if(d)return;d=true;var el=document.getElementById('server-preloader');if(!el)return;el.classList.add('preloader-exit');var bg=el.querySelector('[data-preloader-bg]');var ct=el.querySelector('[data-preloader-content]');if(bg)bg.classList.add('preloader-bg-fade');if(ct)ct.classList.add('preloader-content-exit');setTimeout(function(){el.style.display='none'},700);}document.addEventListener('preloader-ready',dismiss);setTimeout(dismiss,5000);})();`,
          }}
        />
        <NextTopLoader
          color="hsl(210, 24%, 64%)"
          height={2}
          showSpinner={false}
        />
        <Providers
          locale={locale}
          messages={messages}
          initialHasAuthCookie={initialHasAuthCookie}
        >
          {children}
          <ScrollUp />
        </Providers>
        <ScrollUpButton />
      </body>
    </html>
  );
}
