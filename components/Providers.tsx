"use client";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { SWRConfig } from "swr";

import AudioPlayerBar from "@/components/AudioPlayerBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { AudioProvider } from "@/lib/providers/AudioProvider";
import { ReadyStateProvider } from "@/lib/providers/ReadyStateProvider";
import { RestrictionProvider } from "@/lib/providers/RestrictionProvider";
import { SelfProvider } from "@/lib/providers/SelfProvider";
import fetcher from "@/lib/services/fetcher";

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  messages: Record<string, string>;
  initialHasAuthCookie: boolean;
}

function localStorageProvider() {
  if (typeof window === "undefined") {
    return new Map();
  }

  let map = new Map();
  try {
    const stored = localStorage.getItem("moonlight-swr-cache");
    if (stored) {
      map = new Map(JSON.parse(stored));
    }
  }
  catch {
    // Ignore invalid JSON
  }

  window.addEventListener("beforeunload", () => {
    try {
      const appCache = JSON.stringify(Array.from(map.entries()));
      localStorage.setItem("moonlight-swr-cache", appCache);
    }
    catch {
      // Ignore quota exceeded
    }
  });

  return map as Map<any, any>;
}

export default function Providers({
  children,
  locale,
  messages,
  initialHasAuthCookie,
}: ProvidersProps) {
  return (
    <SWRConfig
      value={{
        provider: localStorageProvider,
        fetcher,
        refreshInterval: 1000 * 30,
        dedupingInterval: 1000 * 10,
      }}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        forcedTheme="dark"
        disableTransitionOnChange
      >
        <ReadyStateProvider>
          <SelfProvider initialHasAuthCookie={initialHasAuthCookie}>
            <RestrictionProvider>
              <AudioProvider>
                <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
                  {children}
                  <Toaster />
                  <AudioPlayerBar />
                </NextIntlClientProvider>
              </AudioProvider>
            </RestrictionProvider>
          </SelfProvider>
        </ReadyStateProvider>
      </ThemeProvider>
    </SWRConfig>
  );
}
