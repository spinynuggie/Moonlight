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
      className="text-current/30 relative cursor-pointer px-2 py-1 opacity-40 transition-[color,opacity] duration-300 ease-in-out hover:text-current group-hover:opacity-100 group-data-[scrolled]:opacity-100"
    >
      {/* @ts-expect-error -- We handle props the same way as Wrapper object */}
      <Wrapper {...wrapperProps}>
        <p className="text-nowrap rounded-md p-1 text-base transition-[background-color,color] duration-200 ease-in-out hover:bg-accent">
          <span className="relative inline-flex">
            <span className="invisible text-center font-bold" aria-hidden="true">
              {name}
            </span>
            <span className={`absolute inset-0 text-center ${isActive ? "font-bold text-current" : ""}`}>
              {name}
            </span>
          </span>
        </p>
      </Wrapper>

      {isActive && (
        <motion.span
          layoutId="header-nav-underline"
          className="absolute right-2 top-full mt-0.5 inline-block h-[3px] w-[calc(100%-16px)] rounded-3xl bg-current group-hover:bg-primary group-data-[scrolled]:bg-primary"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </div>
  );
}
