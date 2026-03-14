"use client";
import Autoplay from "embla-carousel-autoplay";
import { BookOpenCheck, DoorOpen, Download } from "lucide-react";
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
  // TODO: Soon™...
  // {
  //   title: "Anti-Cheat Protection",
  //   description:
  //     "We take cheating seriously — our advanced anti-cheat systems constantly monitor and detect suspicious or manipulated scores.",
  //   imageUrl: "/images/not-found.jpg",
  // },
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
  const [carouselCount, setCarouselCount] = useState(0);
  const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));

  useEffect(() => {
    if (serverStatus?.is_on_maintenance && isMaintenanceDialogOpen == null) {
      setMaintenanceDialogOpen(true);
    }
  }, [serverStatus?.is_on_maintenance, isMaintenanceDialogOpen]);

  useEffect(() => {
    if (!carouselApi)
      return;

    setCarouselCount(carouselApi.scrollSnapList().length);
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
    <div className="w-full space-y-8">
      <div className="flex w-full items-center justify-center px-4 md:px-0">
        <div ref={heroRef} className="relative z-20 mt-0 w-full md:mt-16">
          <div ref={heroContentRef} className="w-full will-change-[opacity]">
            <Card className="hero-card-animate overflow-hidden border-white/10 bg-background/50 shadow-lg backdrop-blur-lg">
              <div className="mx-auto max-w-2xl px-4 pb-6 pt-10 text-center md:pb-8 md:pt-24">
                <div className="space-y-3">
                  <h1 className="hero-animate text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
                    <span className="text-primary">
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
                <p className="hero-animate hero-animate-delay-2 mt-5 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {t("features.description")}
                </p>
                <div className="hero-animate hero-animate-delay-3 mt-6 flex items-center justify-center gap-4">
                  <Button
                    className="smooth-transition animate-gradient bg-gradient-to-r from-[#8DA3B9] to-[#252525]/50 bg-[length:300%_300%] hover:scale-105"
                    size="lg"
                    asChild
                  >
                    <Link href="/register">{t("features.buttons.register")}</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/wiki#How%20to%20connect">
                      {t("features.buttons.wiki")}
                    </Link>
                  </Button>
                </div>

              </div>

              <div className="group/marquee overflow-hidden pb-8 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] lg:pb-10 lg:[mask-image:none]">
                <div className="flex w-max animate-[badge-marquee_20s_linear_infinite] gap-2 [backface-visibility:hidden] [will-change:transform] group-hover/marquee:[animation-play-state:paused] lg:w-full lg:animate-none lg:justify-center lg:px-4">
                  <div className="hero-animate hero-animate-delay-4">
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
                  </div>
                  <div className="hero-animate hero-animate-delay-5">
                    <ServerStatus type="total_users" data={serverStatus?.total_users}>
                      {serverStatus && (
                        <RecentUsersIcons users={serverStatus.recent_users!} />
                      )}
                    </ServerStatus>
                  </div>
                  <div className="hero-animate hero-animate-delay-6">
                    <ServerStatus type="users_online" data={serverStatus?.users_online}>
                      {serverStatus && (
                        <RecentUsersIcons users={serverStatus.current_users_online!} />
                      )}
                    </ServerStatus>
                  </div>
                  <div className="hero-animate hero-animate-delay-7">
                    <ServerStatus
                      type="users_restricted"
                      data={serverStatus?.total_restrictions ?? undefined}
                    />
                  </div>
                  <div className="hero-animate hero-animate-delay-8">
                    <ServerStatus type="total_scores" data={serverStatus?.total_scores ?? undefined} />
                  </div>

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
            </Card>
          </div>
        </div>
      </div>

      <div className="w-full pb-12">
        <div className="scroll-reveal mb-8 text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("whyUs")}
          </h2>
        </div>

        <Carousel
          className="scroll-reveal scroll-reveal-delay-1 w-full"
          opts={{ loop: true }}
          plugins={[autoplayPlugin.current]}
          setApi={setCarouselApi}
        >
          <CarouselContent className="-ml-1">
            {cards.map((card, cardIndex) => (
              <CarouselItem
                key={`card-${card.titleKey}`}
                className="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-2">
                  <Card className={`group h-full overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
                    cardIndex === carouselCurrent
                      ? "scale-[1.02] shadow-lg ring-1 ring-primary/30"
                      : "scale-[0.97] opacity-60"
                  }`}
                  >
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={card.imageUrl || "/placeholder.svg"}
                        alt={card.titleKey}
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

        {carouselCount > 0 && (
          <div className="mx-auto mt-4 flex max-w-sm justify-center gap-1.5">
            {Array.from({ length: carouselCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => carouselApi?.scrollTo(i)}
                className="relative h-1 flex-1 cursor-pointer overflow-hidden rounded-full bg-muted"
              >
                {i === carouselCurrent && (
                  <div key={carouselCurrent} className="absolute inset-y-0 left-0 animate-[carousel-progress_5s_linear_forwards] rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full p-4">
        <div className="scroll-reveal mb-8 space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("howToStart.title")}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {t("howToStart.description")}
          </p>
        </div>

        <div className="space-y-3">
          <div className="scroll-reveal scroll-reveal-delay-1">
            <PrettyHeader icon={<Download />} className="rounded-lg transition-shadow duration-200 hover:shadow-md">
              <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
                <div className="mx-2 flex w-full flex-col">
                  <p className="font-bold tracking-tight">{t("howToStart.downloadTile.title")}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("howToStart.downloadTile.description")}
                  </p>
                </div>
                <Button className="shrink-0 md:w-auto md:min-w-[140px]" asChild>
                  <Link href="https://osu.ppy.sh/home/download">
                    {t("howToStart.downloadTile.button")}
                  </Link>
                </Button>
              </div>
            </PrettyHeader>
          </div>
          <div className="scroll-reveal scroll-reveal-delay-2">
            <PrettyHeader icon={<DoorOpen />} className="rounded-lg transition-shadow duration-200 hover:shadow-md">
              <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
                <div className="mx-2 flex w-full flex-col">
                  <p className="font-bold tracking-tight">{t("howToStart.registerTile.title")}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("howToStart.registerTile.description")}
                  </p>
                </div>
                <Button className="shrink-0 md:w-auto md:min-w-[140px]" asChild>
                  <Link href="/register">
                    {t("howToStart.registerTile.button")}
                  </Link>
                </Button>
              </div>
            </PrettyHeader>
          </div>
          <div className="scroll-reveal scroll-reveal-delay-3">
            <PrettyHeader icon={<BookOpenCheck />} className="rounded-lg transition-shadow duration-200 hover:shadow-md">
              <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
                <div className="mx-2 flex w-full flex-col">
                  <p className="font-bold tracking-tight">{t("howToStart.guideTile.title")}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t("howToStart.guideTile.description")}
                  </p>
                </div>
                <Button className="shrink-0 md:w-auto md:min-w-[140px]" asChild>
                  <Link href="/wiki#How%20to%20connect">
                    {t("howToStart.guideTile.button")}
                  </Link>
                </Button>
              </div>
            </PrettyHeader>
          </div>
        </div>
      </div>

      <ServerMaintenanceDialog
        open={!!isMaintenanceDialogOpen}
        setOpen={setMaintenanceDialogOpen}
      />
    </div>
  );
}
