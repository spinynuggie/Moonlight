"use client";

import Cookies from "js-cookie";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useMemo, useState } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import { CountryCode } from "@/lib/types/api";
import { cn } from "@/lib/utils";

interface CountryFilterProps {
  value: CountryCode | null;
  onChange: (country: CountryCode | null) => void;
}

export function CountryFilter({ value, onChange }: CountryFilterProps) {
  const t = useT("pages.leaderboard");
  const [open, setOpen] = useState(false);
  const { self } = useSelf();

  const regionNames = useMemo(
    () => new Intl.DisplayNames([Cookies.get("locale") || "en"], { type: "region" }),
    [],
  );

  const countries = useMemo(() => {
    return Object.values(CountryCode)
      .filter(v => v !== CountryCode.XX)
      .map(code => ({
        code,
        name: regionNames.of(code) ?? code,
      }))
      .sort((a, b) => {
        if (self?.country_code === a.code)
          return -1;
        if (self?.country_code === b.code)
          return 1;
        return a.name.localeCompare(b.name);
      });
  }, [regionNames, self?.country_code]);

  const selectedCountry = countries.find(c => c.code === value);
  const isActive = selectedCountry != null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-1 whitespace-nowrap rounded px-2 py-1 text-[13px] transition-all duration-150",
            isActive
              ? "bg-secondary font-semibold text-primary"
              : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground/70",
          )}
          style={{ animation: "fade-in 300ms ease-out 300ms backwards" }}
        >
          {selectedCountry ? (
            <>
              <img
                src={`/images/flags/${selectedCountry.code}.png`}
                alt=""
                className="size-4"
              />
              {selectedCountry.name}
            </>
          ) : (
            <>
              <Globe className="size-3.5" />
              {t("country.all")}
            </>
          )}
          <ChevronDown className="size-3 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start">
        <Command>
          <CommandInput placeholder={t("country.searchPlaceholder")} />
          <CommandList>
            <CommandEmpty>{t("country.noResults")}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="__all_countries__"
                keywords={[t("country.all")]}
                onSelect={() => {
                  onChange(null);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 size-4",
                    value === null ? "opacity-100" : "opacity-0",
                  )}
                />
                <Globe className="mr-1 size-4 opacity-50" />
                {t("country.all")}
              </CommandItem>
              {countries.map(country => (
                <CommandItem
                  key={country.code}
                  value={country.code}
                  keywords={[country.name]}
                  onSelect={() => {
                    onChange(country.code);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      value === country.code ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <img
                    src={`/images/flags/${country.code}.png`}
                    alt=""
                    className="mr-1 size-4"
                  />
                  {country.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
