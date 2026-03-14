"use client";
import { BookOpenCheck, DoorOpen, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

import BackgroundVideo from "@/app/(website)/(site)/components/BackgroundVideo";
import RecentUsersIcons from "@/app/(website)/(site)/components/RecentUsersIcons";
import ServerStatus from "@/app/(website)/(site)/components/ServerStatus";
import PrettyHeader from "@/components/General/PrettyHeader";
import RoundedContent from "@/components/General/RoundedContent";
import ServerMaintenanceDialog from "@/components/ServerMaintenanceDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  const videoUrls = [0, 1, 2, 3].map(n => `/api/getVideo?id=${n}`);
  const [isMaintenanceDialogOpen, setMaintenanceDialogOpen] = useState<
    boolean | null
  >(null);

  const t = useT("pages.mainPage");
  const tGeneral = useT("general");

  const serverStatusQuery = useServerStatus();
  const serverStatus = serverStatusQuery.data;

  if (serverStatus?.is_on_maintenance && isMaintenanceDialogOpen == null) {
    setMaintenanceDialogOpen(true);
  }

  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!heroRef.current || !heroContentRef.current)
      return;
    const rect = heroRef.current.getBoundingClientRect();
    const scrollProgress = Math.min(1, Math.max(0, -rect.top / rect.height));
    const opacity = `${Math.max(0, 1 - scrollProgress * 1.5)}`;
    heroContentRef.current.style.opacity = opacity;
    if (badgesRef.current) {
      badgesRef.current.style.opacity = opacity;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useScrollReveal();

  return (
    <div className="w-full space-y-8">
      <div className="flex w-full items-center justify-center">
        <div ref={heroRef} className="relative z-20 mt-0 flex w-full place-content-between md:mt-16">
          <div ref={heroContentRef} className="w-full will-change-[opacity]">
            <RoundedContent
              className={twMerge(
                "bg-transparent md:bg-gradient-to-r bg-gradient-to-t from-background via-background to-transparent",
                "w-full py-0 px-4 rounded-lg place-content-between space-x-4 flex md:flex-row flex-col-reverse",
              )}
            >
              <div className="my-4 flex flex-col justify-center space-y-5 md:w-5/12">
                <div className="space-y-3">
                  <h1 className="hero-animate text-5xl font-black tracking-tight sm:text-6xl md:text-7xl">
                    <span className="dark text-primary">
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
                <p className="hero-animate hero-animate-delay-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {t("features.description")}
                </p>
                <div className="hero-animate hero-animate-delay-3 flex items-center gap-4">
                  <Button
                    className="smooth-transition animate-gradient bg-gradient-to-r from-[#8DA3B9] to-[#252525] bg-[length:300%_300%] hover:scale-105"
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

              <div className="relative w-full md:w-7/12 lg:w-5/12">
                <div className="md:-mt-28">
                  <Image
                    src="/images/frontpage.png"
                    alt="frontpage image"
                    width={1150}
                    height={1150}
                    className="size-full rounded-lg md:min-h-96 md:min-w-96"
                  />
                </div>
              </div>
            </RoundedContent>
          </div>

          <div className="absolute inset-0 -z-10 overflow-hidden rounded-lg">
            <BackgroundVideo
              urls={videoUrls}
              className="relative size-full object-cover md:translate-x-1/4"
            />
          </div>
        </div>
      </div>

      <div ref={badgesRef} className="flex flex-wrap justify-center gap-2 will-change-[opacity]">
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
          {serverStatus && (
            <ServerStatus
              type="users_restricted"
              data={serverStatus.total_restrictions!}
            />
          )}
        </div>
        <div className="hero-animate hero-animate-delay-8">
          {serverStatus && (
            <ServerStatus type="total_scores" data={serverStatus.total_scores!} />
          )}
        </div>
      </div>

      <div className="w-full pb-12">
        <div className="scroll-reveal mb-8 text-center">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            {t("whyUs")}
          </h2>
        </div>

        <Carousel className="scroll-reveal scroll-reveal-delay-1 w-full">
          <CarouselContent className="-ml-1">
            {cards.map(card => (
              <CarouselItem
                key={`card-${card.titleKey}`}
                className="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-2">
                  <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
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
      </div>

      <div className="w-full p-4">
        <div className="scroll-reveal mb-8 space-y-2">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
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
