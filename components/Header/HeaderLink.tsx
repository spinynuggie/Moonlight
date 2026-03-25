"use client";

import { motion } from "framer-motion";
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

  const Wrapper = href ? Link : React.Fragment;
  const wrapperProps = href ? { href } : {};

  return (
    <div
      aria-label={name}
      className="text-current/30 relative cursor-pointer px-2 py-1 opacity-40 transition-[color,opacity] duration-200 ease-in-out hover:text-current group-hover:opacity-100"
    >
      {/* @ts-expect-error -- We handle props the same way as Wrapper object */}
      <Wrapper {...wrapperProps}>
        <p
          className={`text-base ${
            isActive ? "font-bold text-current" : ""
          } text-nowrap rounded-md p-1 transition-[background-color,color] duration-200 ease-in-out hover:bg-accent`}
        >
          {name}

          {isActive && (
            <motion.span
              layoutId="header-active-indicator"
              className="absolute right-2 top-full mt-0.5 inline-block h-[3px] w-[calc(100%-16px)] rounded-3xl bg-current group-hover:bg-primary"
              transition={{ type: "tween", duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            />
          )}
          {!isActive && (
            <span
              className="smooth-transition absolute right-2 top-full mt-0.5 inline-block h-[3px] w-[calc(100%-16px)] rounded-3xl opacity-0"
            />
          )}
        </p>
      </Wrapper>
    </div>
  );
}
