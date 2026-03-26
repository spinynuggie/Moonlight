"use client";
import Autoplay from "embla-carousel-autoplay";
import { BookOpenCheck, ChevronDown, DoorOpen, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import RecentUsersIcons from "@/app/(website)/(site)/components/RecentUsersIcons";
import ServerStatus from "@/app/(website)/(site)/components/ServerStatus";
import PrettyHeader from "@/components/General/PrettyHeader";
import ServerMaintenanceDialog from "@/components/ServerMaintenanceDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useServerStatus } from "@/lib/hooks/api/useServerStatus";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { useT } from "@/lib/i18n/utils";
import { cn } from "@/lib/utils";

const cards = [
  {
    titleKey: "cards.freeFeatures.title",
    descriptionKey: "cards.freeFeatures.description",
    imageUrl: "/images/frontpage/freefeatures.png",
  },
  {
    titleKey: "cards.ppSystem.title",
    descriptionKey: "cards.ppSystem.description",
    imageUrl: "/images/frontpage/ppsystem.png",
  },
  {
    titleKey: "cards.medals.title",
    descriptionKey: "cards.medals.description",
    imageUrl: "/images/frontpage/medals.png",
  },
  {
    titleKey: "cards.updates.title",
    descriptionKey: "cards.updates.description",
    imageUrl: "/images/frontpage/updates.png",
  },
  {
    titleKey: "cards.ppCalc.title",
    descriptionKey: "cards.ppCalc.description",
    imageUrl: "/images/frontpage/ppcalc.png",
  },
  {
    titleKey: "cards.sunriseCore.title",
    descriptionKey: "cards.sunriseCore.description",
    imageUrl: "/images/frontpage/sunrisecore.png",
  },
];

const steps = [
  {
    icon: <Download />,
    titleKey: "howToStart.downloadTile.title",
    descKey: "howToStart.downloadTile.description",
    buttonKey: "howToStart.downloadTile.button",
    href: "https://osu.ppy.sh/home/download",
  },
  {
    icon: <DoorOpen />,
    titleKey: "howToStart.registerTile.title",
    descKey: "howToStart.registerTile.description",
    buttonKey: "howToStart.registerTile.button",
    href: "/register",
  },
  {
    icon: <BookOpenCheck />,
    titleKey: "howToStart.guideTile.title",
    descKey: "howToStart.guideTile.description",
    buttonKey: "howToStart.guideTile.button",
    href: "/wiki#How%20to%20connect",
  },
];

export default function Home() {
  const [isMaintenanceDialogOpen, setMaintenanceDialogOpen] = useState<
    boolean | null
  >(null);

  const t = useT("pages.mainPage");
  const tGeneral = useT("general");

  const serverStatusQuery = useServerStatus();
  const serverStatus = serverStatusQuery.data;

  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [carouselCurrent, setCarouselCurrent] = useState(0);
  const autoplayPluginRef = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  );

  useEffect(() => {
    if (serverStatus?.is_on_maintenance && isMaintenanceDialogOpen == null) {
      setMaintenanceDialogOpen(true);
    }
  }, [serverStatus?.is_on_maintenance, isMaintenanceDialogOpen]);

  useEffect(() => {
    if (!carouselApi)
      return;

    setCarouselCurrent(carouselApi.selectedScrollSnap());

    const onSelect = () => {
      setCarouselCurrent(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!heroRef.current || !heroContentRef.current)
      return;
    const rect = heroRef.current.getBoundingClientRect();
    const scrollProgress = Math.min(1, Math.max(0, -rect.top / rect.height));
    const opacity = `${Math.max(0, 1 - scrollProgress * 1.5)}`;
    heroContentRef.current.style.opacity = opacity;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useScrollReveal();

  return (
    <div className="w-full">
      {/* ═══════════════ HERO ═══════════════ */}
      <section
        ref={heroRef}
        className="relative -mt-8 flex min-h-[calc(100dvh-3.5rem)] flex-col"
      >
        <div
          ref={heroContentRef}
          className="flex flex-1 flex-col items-center justify-center will-change-[opacity]"
        >
          <div className="mx-auto max-w-3xl px-4 text-center">
            <div className="space-y-4">
              <h1 className="hero-animate text-6xl font-semibold tracking-tight sm:text-7xl md:text-7xl lg:text-8xl">
                <span className="title-glow text-primary">
                  {tGeneral("serverTitle.split.part1")}
                </span>
                <span className="text-current">
                  {tGeneral("serverTitle.split.part2")}
                </span>
              </h1>
              <p className="hero-animate hero-animate-delay-1 text-sm font-medium tracking-wide text-muted-foreground">
                {t("features.motto")}
              </p>
            </div>
            <p className="hero-animate hero-animate-delay-2 mx-auto mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {t("features.description")}
            </p>
            <div className="hero-animate hero-animate-delay-3 mt-8 flex items-center justify-center gap-4">
              <Button
                className="smooth-transition animate-gradient bg-gradient-to-r from-[#8DA3B9] to-[#252525]/50 bg-[length:300%_300%] shadow-[0_0_25px_rgba(141,163,185,0.25)] hover:scale-105 hover:shadow-[0_0_35px_rgba(141,163,185,0.35)]"
                size="lg"
                asChild
              >
                <Link href="/register">{t("features.buttons.register")}</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
              >
                <Link href="/wiki#How%20to%20connect">
                  {t("features.buttons.wiki")}
                </Link>
              </Button>
            </div>
          </div>

          {/* Status bar */}
          <div className="hero-animate hero-animate-delay-4 mt-8 w-full max-w-5xl px-4">
            <div className="group/marquee overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-md [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] lg:rounded-full lg:[mask-image:none]">
              <div className="flex w-max animate-[badge-marquee_20s_linear_infinite] gap-2 [backface-visibility:hidden] [will-change:transform] group-hover/marquee:[animation-play-state:paused] lg:w-full lg:animate-none lg:justify-center lg:px-2">
                <ServerStatus
                  type="server_status"
                  data={
                    serverStatus
                      ? serverStatus.is_online
                        ? serverStatus.is_on_maintenance
                          ? t("statuses.underMaintenance")
                          : t("statuses.online")
                        : t("statuses.offline")
                      : undefined
                  }
                />
                <ServerStatus type="total_users" data={serverStatus?.total_users}>
                  {serverStatus && (
                    <RecentUsersIcons users={serverStatus.recent_users!} />
                  )}
                </ServerStatus>
                <ServerStatus type="users_online" data={serverStatus?.users_online}>
                  {serverStatus && (
                    <RecentUsersIcons users={serverStatus.current_users_online!} />
                  )}
                </ServerStatus>
                <ServerStatus
                  type="users_restricted"
                  data={serverStatus?.total_restrictions ?? undefined}
                />
                <ServerStatus type="total_scores" data={serverStatus?.total_scores ?? undefined} />

                {/* Duplicate set for seamless marquee loop on mobile */}
                <div className="flex gap-2 lg:hidden" aria-hidden="true">
                  <ServerStatus
                    type="server_status"
                    data={
                      serverStatus
                        ? serverStatus.is_online
                          ? serverStatus.is_on_maintenance
                            ? t("statuses.underMaintenance")
                            : t("statuses.online")
                          : t("statuses.offline")
                        : undefined
                    }
                  />
                  <ServerStatus type="total_users" data={serverStatus?.total_users}>
                    {serverStatus && (
                      <RecentUsersIcons users={serverStatus.recent_users!} />
                    )}
                  </ServerStatus>
                  <ServerStatus type="users_online" data={serverStatus?.users_online}>
                    {serverStatus && (
                      <RecentUsersIcons users={serverStatus.current_users_online!} />
                    )}
                  </ServerStatus>
                  <ServerStatus
                    type="users_restricted"
                    data={serverStatus?.total_restrictions ?? undefined}
                  />
                  <ServerStatus type="total_scores" data={serverStatus?.total_scores ?? undefined} />
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="hero-animate hero-animate-delay-8 mt-8 flex flex-col items-center gap-1 text-muted-foreground/40 lg:mt-12">
            <ChevronDown className="scroll-indicator size-5" />
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES — Carousel ═══════════════ */}
      <section className="mt-16 w-full pb-12">
        <div className="scroll-reveal mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("whyUs")}
          </h2>
        </div>

        <Carousel
          className="scroll-reveal scroll-reveal-delay-1 w-full"
          opts={{ loop: true, duration: 30 }}
          plugins={[autoplayPluginRef.current]}
          setApi={setCarouselApi}
        >
          <CarouselContent className="-ml-1">
            {cards.map((card, cardIndex) => (
              <CarouselItem
                key={`card-${card.titleKey}`}
                className="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-2">
                  <Card className={cn(
                    "group h-full overflow-hidden transition-all duration-700 ease-in-out hover:-translate-y-1 hover:shadow-lg",
                    cardIndex === carouselCurrent
                      ? "scale-[1.02] shadow-lg ring-1 ring-border"
                      : "scale-[0.97] brightness-[0.6] grayscale",
                  )}
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={card.imageUrl}
                        alt={t(card.titleKey)}
                        fill
                        className="rounded-t-lg object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="mb-2 font-bold tracking-tight">
                        {t(card.titleKey)}
                      </h3>
                      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {t(card.descriptionKey)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-6 md:-left-12" />
          <CarouselNext className="right-6 md:-right-12" />
        </Carousel>

        {carouselApi && (
          <div className="mx-auto mt-6 flex max-w-xs justify-center gap-2">
            {carouselApi.scrollSnapList().map((snap, snapIndex) => (
              <button
                key={snap}
                onClick={() => carouselApi.scrollTo(snapIndex)}
                className="relative h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-muted-foreground/15"
              >
                {snapIndex === carouselCurrent && (
                  <div
                    key={carouselCurrent}
                    className="absolute inset-y-0 left-0 animate-[carousel-progress_5s_ease-out_forwards] rounded-full bg-primary"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════ HOW TO START ═══════════════ */}
      <section className="mt-16 w-full pb-16">
        <div className="scroll-reveal mb-8 space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("howToStart.title")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("howToStart.description")}
          </p>
        </div>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={step.titleKey}
              className={cn(
                "scroll-reveal",
                index === 0 && "scroll-reveal-delay-1",
                index === 1 && "scroll-reveal-delay-2",
                index === 2 && "scroll-reveal-delay-3",
              )}
            >
              <PrettyHeader icon={step.icon} className="rounded-lg transition-shadow duration-200 hover:shadow-md">
                <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
                  <div className="mx-2 flex w-full flex-col">
                    <p className="font-bold tracking-tight">{t(step.titleKey)}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {t(step.descKey)}
                    </p>
                  </div>
                  <Button className="shrink-0 md:w-auto md:min-w-[140px]" asChild>
                    <Link href={step.href}>
                      {t(step.buttonKey)}
                    </Link>
                  </Button>
                </div>
              </PrettyHeader>
            </div>
          ))}
        </div>
      </section>

      <ServerMaintenanceDialog
        open={!!isMaintenanceDialogOpen}
        setOpen={setMaintenanceDialogOpen}
      />
    </div>
  );
}
