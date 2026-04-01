"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

interface Props {
  name: string;
  href?: string;
}

export default function HeaderLink({ name, href }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const [showActive, setShowActive] = React.useState(false);

  React.useEffect(() => {
    if (isActive) {
      let cancelled = false;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled)
            setShowActive(true);
        });
      });
      return () => { cancelled = true; };
    }
    else {
      setShowActive(false);
    }
  }, [isActive]);

  const Wrapper = href ? Link : React.Fragment;
  const wrapperProps = href ? { href } : {};

  return (
    <div
      aria-label={name}
      className="text-current/30 relative cursor-pointer px-2 py-1 opacity-40 transition-[color,opacity] duration-300 ease-in-out hover:text-current group-hover:opacity-100 group-data-[scrolled]:opacity-100"
    >
      {/* @ts-expect-error -- We handle props the same way as Wrapper object */}
      <Wrapper {...wrapperProps}>
        <p className="text-nowrap rounded-md p-1 text-base transition-[background-color,color] duration-200 ease-in-out hover:bg-accent">
          <span className="relative inline-flex">
            <span className="invisible text-center font-bold" aria-hidden="true">
              {name}
            </span>
            <span
              className={`absolute inset-0 text-center transition-[text-shadow] ${showActive ? "duration-[350ms]" : "duration-200"} ${isActive ? "font-bold text-current" : ""}`}
              style={{
                textShadow: showActive
                  ? "0 0 12px hsl(var(--primary) / 0.5), 0 0 24px hsl(var(--primary) / 0.2)"
                  : "0 0 12px transparent, 0 0 24px transparent",
              }}
            >
              {name}
            </span>
          </span>
        </p>
      </Wrapper>

      <span
        className={`absolute right-2 top-full mt-0.5 inline-block h-[3px] w-[calc(100%-16px)] origin-center rounded-3xl bg-current transition-transform group-hover:bg-primary group-data-[scrolled]:bg-primary ${showActive ? "duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] scale-x-100" : "ease-[cubic-bezier(0.4,0,1,1)] scale-x-0 duration-200"}`}
      />
    </div>
  );
}
