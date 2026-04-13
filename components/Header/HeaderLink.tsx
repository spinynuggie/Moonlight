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
      className="relative cursor-pointer p-1 opacity-40 transition-[color,opacity] duration-300 ease-in-out hover:text-current group-hover:opacity-100 group-data-[scrolled]:opacity-100"
    >
      {/* @ts-expect-error -- We handle props the same way as Wrapper object */}
      <Wrapper {...wrapperProps}>
        <p className={cn(
          "text-nowrap rounded-full px-3 py-1.5 text-base transition-[background-color,color,text-shadow] duration-200 ease-in-out hover:bg-primary/[0.08]",
        )}
        >
          <span
            className={cn(
              "inline-block text-center font-bold transition-[color,text-shadow] duration-300 ease-out",
              isActive && "text-primary",
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
          "absolute left-1/2 top-full mt-0.5 h-[2px] w-5 -translate-x-1/2 rounded-full bg-primary transition-[opacity,transform] duration-300 ease-out",
          isActive
            ? "scale-x-100 opacity-100"
            : "pointer-events-none scale-x-0 opacity-0",
        )}
        style={{
          boxShadow: isActive ? "0 0 8px hsl(var(--primary) / 0.5)" : "none",
        }}
      />
    </div>
  );
}
