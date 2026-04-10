"use client";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { SWRConfig } from "swr";

import AudioPlayerBar from "@/components/AudioPlayerBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { AudioProvider } from "@/lib/providers/AudioProvider";
import { RestrictionProvider } from "@/lib/providers/RestrictionProvider";
import { SelfProvider } from "@/lib/providers/SelfProvider";
import fetcher from "@/lib/services/fetcher";

interface ProvidersProps {
  children: ReactNode;
  locale: string;
  messages: Record<string, string>;
  initialHasAuthCookie: boolean;
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
      </ThemeProvider>
    </SWRConfig>
  );
}
