"use client";

import Image from "next/image";
import { Suspense, useRef } from "react";

import HeaderLoginDialog from "@/components/Header/HeaderLoginDialog";
import HeaderUserDropdown from "@/components/Header/HeaderUserDropdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useSelf from "@/lib/hooks/useSelf";

export default function HeaderAvatar() {
  const { self, isLoading, hasAuthCookie } = useSelf();
  const resolvedRef = useRef(false);

  if (!isLoading)
    resolvedRef.current = true;

  if (!hasAuthCookie) {
    return <HeaderLoginDialog />;
  }

  if (!resolvedRef.current) {
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
          <Button
            variant="link"
            className="rounded-full bg-transparent p-0 focus-visible:ring-0"
          >
            <Avatar className="smooth-transition cursor-pointer hover:scale-110">
              <Suspense fallback={<AvatarFallback>UA</AvatarFallback>}>
                <Image src={self.avatar_url} width={64} height={64} alt="Avatar" />
              </Suspense>
            </Avatar>
          </Button>
        </HeaderUserDropdown>
      )
    : (
        <HeaderLoginDialog />
      );
}
