"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Gift,
  Heart,
  HeartHandshake,
  Quote,
  Search,
  Server,
  ShieldOff,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useUserSearch } from "@/lib/hooks/api/user/useUserSearch";
import useDebounce from "@/lib/hooks/useDebounce";
import useSelf from "@/lib/hooks/useSelf";
import { useT } from "@/lib/i18n/utils";
import type { UserResponse } from "@/lib/types/api";
import { UserBadge } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const whySupportItems = [
  { icon: Code2, key: "development" },
  { icon: Server, key: "infrastructure" },
  { icon: Users, key: "community" },
  { icon: ShieldOff, key: "adFree" },
  { icon: Sparkles, key: "openSource" },
  { icon: HeartHandshake, key: "theBadge" },
] as const;

const MONTH_PRESETS = [1, 2, 4, 6, 12, 18, 24] as const;

function costToMonths(cost: number): number {
  if (cost <= 8)
    return Math.round(cost / 4);
  if (cost <= 16)
    return Math.round(((cost - 8) / 4) * 2 + 2);
  if (cost <= 26)
    return Math.round(((cost - 16) / 10) * 6 + 6);
  return Math.round((cost / 26) * 12);
}

function monthsToCost(months: number): number {
  if (months <= 2)
    return months * 4;
  if (months <= 6)
    return 8 + ((months - 2) / 2) * 4;
  if (months <= 12)
    return 16 + ((months - 6) / 6) * 10;
  return Math.ceil((months / 12) * 26);
}

function getDiscount(months: number): number {
  const fullPrice = months * 4;
  const actualCost = monthsToCost(months);
  if (fullPrice === 0)
    return 0;
  return Math.round(((fullPrice - actualCost) / fullPrice) * 100);
}

export default function SupportUs() {
  const t = useT("pages.support");
  const { self } = useSelf();

  const isSupporter = self?.badges?.includes(UserBadge.SUPPORTER) ?? false;

  const hasKofi = !!process.env.NEXT_PUBLIC_KOFI_LINK;
  const hasBoosty = !!process.env.NEXT_PUBLIC_BOOSTY_LINK;
  const hasDonationLinks = hasKofi || hasBoosty;

  const [sliderValue, setSliderValue] = useState(16);

  const months = useMemo(() => costToMonths(sliderValue), [sliderValue]);
  const discount = useMemo(() => getDiscount(months), [months]);

  const activePreset = useMemo(() => {
    let best: number = MONTH_PRESETS[0];
    for (const preset of MONTH_PRESETS) {
      if (monthsToCost(preset) <= sliderValue) {
        best = preset;
      }
    }
    return best;
  }, [sliderValue]);

  const handlePresetClick = useCallback((preset: number) => {
    setSliderValue(monthsToCost(preset));
  }, []);

  // Gift target user search
  const [giftTarget, setGiftTarget] = useState<UserResponse | null>(null);
  const [isGifting, setIsGifting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 400);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const giftListboxId = useId();

  const giftListOpen = showDropdown && debouncedQuery.length >= 2;

  const { data: searchResults, isLoading: isSearching } = useUserSearch(
    isGifting && debouncedQuery.length >= 2 ? debouncedQuery : null,
    undefined,
    5,
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!giftListOpen)
      return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setShowDropdown(false);
        searchInputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [giftListOpen]);

  const handleSelectUser = (user: UserResponse) => {
    setGiftTarget(user);
    setSearchQuery("");
    setShowDropdown(false);
  };

  const handleCancelGift = () => {
    setIsGifting(false);
    setGiftTarget(null);
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col gap-1 rounded-[10px] border border-border/50 bg-card p-4 shadow-md"
      >
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">
            <HeartHandshake className="size-5" />
          </span>
          <h1 className="text-lg font-semibold">{t("header")}</h1>
        </div>
        <p className="pl-7 text-sm text-muted-foreground">{t("subtitle")}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
      >
        <Alert
          className="flex items-center gap-3 rounded-[10px] border-primary/35 bg-primary/[0.06] shadow-md [&>svg+div]:translate-y-0 [&>svg]:static [&>svg]:shrink-0 [&>svg]:text-primary [&>svg~*]:pl-0"
          role="status"
          aria-live="polite"
        >
          <Sparkles className="size-4" />
          <div>
            <AlertTitle className="text-primary">{t("wipTitle")}</AlertTitle>
            <AlertDescription className="mt-1 text-muted-foreground">
              {t("wipDescription")}
            </AlertDescription>
          </div>
        </Alert>
      </motion.div>

      {/* ═══════════════ SECTION 1: WHAT YOU GET ═══════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md"
      >
        <div className="flex flex-col items-center gap-6 p-8 md:p-10">
          <h2 className="text-xl font-bold tracking-tight text-primary">
            {t("whatYouGetTitle")}
          </h2>

          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative flex size-20 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10">
              <div className="absolute inset-0 rounded-full bg-primary/5 blur-xl" />
              <HeartHandshake className="relative size-10 text-primary" />
            </div>

            <div className="max-w-lg">
              <h3 className="text-base font-semibold">
                {t("whatYouGetBadgeTitle")}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("whatYouGetBadgeDescription")}
              </p>
            </div>
          </div>

          <div className="mt-2 rounded-lg border border-border/50 bg-secondary/30 px-6 py-4 text-center">
            <p className="text-xs font-medium text-muted-foreground">
              {t("philosophy")}
            </p>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════ SECTION 2: DONATION SLIDER ═══════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        className="overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md"
      >
        <div className="flex flex-col items-center gap-6 p-8 md:p-10">
          <div className="flex w-full max-w-md flex-col items-center gap-1 text-center">
            <h2 className="text-xl font-bold tracking-tight text-primary">
              {t("chooseSupportTitle")}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("chooseSupportDescription")}
            </p>
          </div>

          {/* Gift target / user search */}
          <div className="flex w-full max-w-md flex-col items-center gap-3">
            {!isGifting ? (
              <div className="flex flex-col items-center gap-3">
                {self && (
                  <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-secondary/20 px-4 py-3">
                    <Avatar className="size-10">
                      <AvatarImage src={self.avatar_url} alt={self.username} />
                      <AvatarFallback>{self.username[0]}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-medium">{self.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {t("giftSelf")}
                      </p>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setIsGifting(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <Gift className="size-3.5" />
                  {t("giftOther")}
                </button>
              </div>
            ) : (
              <div className="w-full" ref={dropdownRef}>
                {giftTarget ? (
                  <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10">
                        <AvatarImage
                          src={giftTarget.avatar_url}
                          alt={giftTarget.username}
                        />
                        <AvatarFallback>
                          {giftTarget.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{giftTarget.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {t("giftRecipient")}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelGift}
                      className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                        <Input
                          ref={searchInputRef}
                          type="text"
                          role="combobox"
                          aria-expanded={giftListOpen}
                          aria-controls={giftListboxId}
                          aria-haspopup="listbox"
                          aria-autocomplete="list"
                          placeholder={t("giftSearchPlaceholder")}
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowDropdown(true);
                          }}
                          onFocus={() => setShowDropdown(true)}
                          className="pl-8"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleCancelGift}
                        className="rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        <X className="size-4" />
                      </button>
                    </div>

                    {giftListOpen && (
                      <div
                        id={giftListboxId}
                        role="listbox"
                        aria-busy={isSearching}
                        aria-label={t("giftSearchPlaceholder")}
                        className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg"
                        onKeyDown={(e) => {
                          if (e.key === "Escape") {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowDropdown(false);
                            searchInputRef.current?.focus();
                          }
                        }}
                      >
                        {isSearching ? (
                          <div className="px-4 py-3 text-center text-xs text-muted-foreground">
                            {t("giftSearching")}
                          </div>
                        ) : searchResults && searchResults.length > 0
                          ? (
                              <div className="max-h-48 overflow-y-auto">
                                {searchResults.map(user => (
                                  <button
                                    key={user.user_id}
                                    type="button"
                                    role="option"
                                    onClick={() => handleSelectUser(user)}
                                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent"
                                  >
                                    <Avatar className="size-8">
                                      <AvatarImage
                                        src={user.avatar_url}
                                        alt={user.username}
                                      />
                                      <AvatarFallback>
                                        {user.username[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium">
                                      {user.username}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )
                          : (
                              <div
                                className="px-4 py-3 text-center text-xs text-muted-foreground"
                                role="status"
                              >
                                {t("giftNoResults")}
                              </div>
                            )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Price callout */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              USD ${sliderValue.toFixed(0)}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {months === 1
                ? t("sliderMonth")
                : months === 12
                  ? t("sliderYear")
                  : t("sliderMonths", { count: String(months) })}
            </span>
            {discount > 0 && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {t("sliderDiscount", { discount: String(discount) })}
              </span>
            )}
          </div>

          {/* Slider */}
          <div className="w-full max-w-md">
            <Slider
              value={[sliderValue]}
              onValueChange={val => setSliderValue(val[0])}
              min={4}
              max={52}
              step={1}
              className="w-full"
            />
          </div>

          {/* Preset buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {MONTH_PRESETS.map((preset) => {
              const isActive = activePreset === preset;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className={cn(
                    "smooth-transition rounded-md border px-3 py-1.5 text-xs font-medium",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                  )}
                >
                  {preset === 1
                    ? t("sliderMonth")
                    : preset === 12
                      ? t("sliderYear")
                      : t("sliderMonths", { count: String(preset) })}
                </button>
              );
            })}
          </div>

          {/* Price breakdown */}
          <div className="w-full max-w-md rounded-lg border border-border/50 bg-secondary/20 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t("sliderFullPrice")}</span>
              <span>${(months * 4).toFixed(0)}</span>
            </div>
            {discount > 0 && (
              <div className="mt-1 flex items-center justify-between text-xs text-primary">
                <span>{t("sliderYouSave")}</span>
                <span>-${(months * 4 - sliderValue).toFixed(0)}</span>
              </div>
            )}
            <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-2 text-sm font-semibold text-foreground">
              <span>{t("sliderTotal")}</span>
              <span>${sliderValue.toFixed(0)}</span>
            </div>
          </div>

          <div className="flex w-full max-w-md flex-col items-center gap-2">
            <Button
              size="lg"
              className="w-full font-medium"
              disabled
              aria-disabled="true"
            >
              <Heart className="mr-2 size-4" />
              {t("checkoutButton")}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {t("checkoutStripeSoon")}
            </p>
            {hasDonationLinks && (
              <p className="text-center text-xs text-muted-foreground">
                {t("checkoutUseExternalLinks")}
              </p>
            )}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════ SECTION 3: WHERE YOUR SUPPORT GOES ═══════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
        className="overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md"
      >
        <div className="p-8 md:p-10">
          <div className="mb-6 border-b border-border/40 pb-4 text-center">
            <h2 className="text-xl font-bold tracking-tight text-primary">
              {t("whySupportTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {whySupportItems.map(({ icon: Icon, key }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  delay: 0.25 + i * 0.06,
                }}
                className="group relative overflow-hidden rounded-[10px] border border-border/50 bg-secondary/20 p-5 shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.05] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative z-10 flex flex-col items-center gap-3 text-center">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 transition-colors duration-200 group-hover:bg-primary/15">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold tracking-tight">
                      {t(`whySupport_${key}_title`)}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t(`whySupport_${key}_description`)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══════════════ SECTION 4: CTA + QUOTE (SIDE BY SIDE) ═══════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.35 }}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {/* CTA */}
        <div className="relative overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, hsl(var(--primary) / 0.06) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              maskImage:
                "linear-gradient(to top left, black 30%, transparent 80%)",
              WebkitMaskImage:
                "linear-gradient(to top left, black 30%, transparent 80%)",
            }}
          />

          <div className="relative flex h-full flex-col items-center justify-center gap-5 p-8">
            <div
              className={cn(
                "flex size-16 items-center justify-center rounded-full border-2",
                isSupporter
                  ? "heart-pulse border-primary/50 bg-primary/10"
                  : "border-border/50 bg-muted/30",
              )}
            >
              <Heart
                className={cn(
                  "size-8",
                  isSupporter
                    ? "fill-primary text-primary"
                    : "text-muted-foreground",
                )}
              />
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight">
                {t("ctaTitle")}
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {self
                  ? isSupporter
                    ? t("statusActive")
                    : t("statusInactive")
                  : t("ctaDescription")}
              </p>
            </div>

            {hasDonationLinks ? (
              <div className="flex flex-wrap items-center justify-center gap-3">
                {hasKofi && (
                  <Button size="lg" className="font-medium" asChild>
                    <Link
                      href={process.env.NEXT_PUBLIC_KOFI_LINK!}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Heart className="mr-2 size-4" />
                      {t("ctaKofi")}
                    </Link>
                  </Button>
                )}
                {hasBoosty && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-medium"
                    asChild
                  >
                    <Link
                      href={process.env.NEXT_PUBLIC_BOOSTY_LINK!}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Heart className="mr-2 size-4" />
                      {t("ctaBoosty")}
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("ctaComingSoon")}
              </p>
            )}

            <p className="text-xs text-muted-foreground">
              {t("ctaNote")}
            </p>
          </div>
        </div>

        {/* Quote */}
        <div className="relative overflow-hidden rounded-[10px] border border-border/50 bg-secondary/50 shadow-md">
          <div className="pointer-events-none absolute -left-4 -top-2 text-muted-foreground/10">
            <Quote className="size-24 rotate-180" />
          </div>
          <div className="pointer-events-none absolute -bottom-2 -right-4 text-muted-foreground/10">
            <Quote className="size-24" />
          </div>

          <div className="relative flex h-full flex-col justify-center px-8 py-10">
            <blockquote className="text-center text-sm leading-relaxed text-muted-foreground">
              {t("quoteText")}
            </blockquote>
            <p className="mt-4 text-center text-xs font-medium text-primary">
              {t("quoteAuthor")}
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
