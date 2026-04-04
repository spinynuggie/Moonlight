"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import { cn } from "@/lib/utils";

interface Props {
  name: string;
  href?: string;
}

export default function HeaderLink({ name, href }: Props) {
  const pathname = usePathname();
  const isActive = Boolean(href && pathname === href);

  const Wrapper = href ? Link : Fragment;
  const wrapperProps = href ? { href } : {};

  return (
    <div
      aria-label={name}
      className="text-current/30 relative cursor-pointer px-2 py-1 opacity-40 transition-[color,opacity] duration-300 ease-in-out hover:text-current group-hover:opacity-100 group-data-[scrolled]:opacity-100"
    >
      {/* @ts-expect-error -- We handle props the same way as Wrapper object */}
      <Wrapper {...wrapperProps}>
        <p className="text-nowrap rounded-md p-1 text-base transition-[background-color,color,text-shadow] duration-200 ease-in-out hover:bg-accent">
          <span
            className={cn(
              "inline-block text-center font-bold transition-[color,text-shadow] duration-300 ease-out",
              isActive && "text-current",
            )}
            style={{
              textShadow: isActive
                ? "0 0 12px hsl(var(--primary) / 0.5), 0 0 24px hsl(var(--primary) / 0.2)"
                : "0 0 12px transparent, 0 0 24px transparent",
            }}
          >
            {name}
          </span>
        </p>
      </Wrapper>

      <span
        aria-hidden
        className={cn(
          "absolute right-2 top-full mt-0.5 inline-block h-[3px] w-[calc(100%-16px)] rounded-3xl bg-current transition-opacity duration-300 ease-out group-hover:bg-primary group-data-[scrolled]:bg-primary",
          isActive ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
    </div>
  );
}
