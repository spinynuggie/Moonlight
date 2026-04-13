"use client";

import Cookies from "js-cookie";
import { Check, Languages } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useCallback, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AVAILABLE_LOCALES, DISPLAY_NAMES_LOCALES } from "@/lib/i18n/messages";
import { getCountryCodeForLocale } from "@/lib/i18n/utils";
import { cn } from "@/lib/utils";

export function LanguageSelector() {
  const router = useRouter();
  const currentLocale = useLocale();

  const changeLanguage = useCallback(
    (locale: string) => {
      Cookies.set("locale", locale);
      router.refresh();
    },
    [router],
  );

  const getLanguageName = useCallback(
    (locale: string, displayLocale: string = currentLocale) => {
      try {
        const displayNames = new Intl.DisplayNames([displayLocale], {
          type: "language",
        });

        const name
          = DISPLAY_NAMES_LOCALES[locale]
            || displayNames.of(locale)
            || locale.toUpperCase();
        return name;
      }
      catch {
        return DISPLAY_NAMES_LOCALES[locale] || locale.toUpperCase();
      }
    },
    [currentLocale],
  );

  const languages = useMemo(() => {
    return AVAILABLE_LOCALES.map(localeCode => ({
      code: localeCode,
      countryCode: getCountryCodeForLocale(localeCode),
      nativeName: getLanguageName(localeCode, localeCode),
    }));
  }, [getLanguageName]);

  const isEnglishOnlyPossibleLanguage = languages.every(language => language.code === "en");

  if (isEnglishOnlyPossibleLanguage) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="smooth-transition size-7 cursor-pointer rounded-md p-1 opacity-40 hover:bg-accent group-hover:opacity-100 group-data-[scrolled]:opacity-100 md:size-8"
          aria-label="Select language"
        >
          <Languages className="h-[1.2rem] w-[1.2rem] md:size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[calc(100vw-2rem)] min-w-[200px] max-w-[280px] rounded-[16px] border-border/50 bg-card/95 p-1.5 shadow-xl backdrop-blur md:w-auto md:min-w-[200px]"
        sideOffset={8}
      >
        {languages
          .sort((a, b) => a.nativeName.localeCompare(b.nativeName))
          .map((locale) => {
            const isActive = locale.code === currentLocale;

            return (
              <DropdownMenuItem
                key={locale.code}
                onClick={() => changeLanguage(locale.code)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-[10px] px-3 py-2.5 focus:bg-primary/[0.08]",
                  isActive && "bg-primary/[0.08]",
                )}
              >
                <Image
                  src={`/images/flags/${locale.countryCode}.png`}
                  alt={`${locale.nativeName} flag`}
                  width={24}
                  height={24}
                  className="size-5 flex-shrink-0 md:size-6"
                />
                <span className="flex-1 font-medium capitalize">
                  {locale.nativeName}
                </span>
                {isActive && (
                  <Check className="size-4 flex-shrink-0 text-primary" />
                )}
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
