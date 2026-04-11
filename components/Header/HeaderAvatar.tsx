"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import HeaderLoginDialog from "@/components/Header/HeaderLoginDialog";
import HeaderUserDropdown from "@/components/Header/HeaderUserDropdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import useSelf from "@/lib/hooks/useSelf";

export default function HeaderAvatar() {
  const { self, isLoading, hasAuthCookie } = useSelf();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Before hydration, render what the server would render to avoid mismatch
  if (!mounted) {
    return hasAuthCookie
      ? (
          <Avatar className="smooth-transition">
            <AvatarFallback>
              <Skeleton className="size-full rounded-full" />
            </AvatarFallback>
          </Avatar>
        )
      : <HeaderLoginDialog />;
  }

  if (!hasAuthCookie)
    return <HeaderLoginDialog />;

  if (isLoading) {
    return (
      <Avatar className="smooth-transition">
        <AvatarFallback>
          <Skeleton className="size-full rounded-full" />
        </AvatarFallback>
      </Avatar>
    );
  }

  return self
    ? (
        <HeaderUserDropdown self={self}>
          <span className="smooth-transition relative flex size-10 shrink-0 cursor-pointer overflow-hidden rounded-full hover:scale-110">
            <Image src={self.avatar_url} width={64} height={64} alt="Avatar" className="aspect-square size-full" />
          </span>
        </HeaderUserDropdown>
      )
    : <HeaderLoginDialog />;
}
