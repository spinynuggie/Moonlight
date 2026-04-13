"use client";

import { motion } from "framer-motion";
import type * as React from "react";

import { cn } from "@/lib/utils";

export function FilterPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      transition={{
        height: { type: "spring", stiffness: 200, damping: 28 },
        opacity: { duration: 0.25 },
      }}
      className={cn("overflow-hidden rounded-[10px] border border-border/50 bg-card shadow-md", className)}
    >
      {children}
    </motion.div>
  );
}
