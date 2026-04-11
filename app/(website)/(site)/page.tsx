"use client";

import dynamic from "next/dynamic";

import LandingPage from "@/app/(website)/(site)/components/LandingPage";
import useSelf from "@/lib/hooks/useSelf";

const HomeLoggedIn = dynamic(() => import("@/app/(website)/(site)/components/HomeLoggedIn"), { ssr: false });

export default function Home() {
  const { hasAuthCookie } = useSelf();

  return hasAuthCookie ? <HomeLoggedIn /> : <LandingPage />;
}
