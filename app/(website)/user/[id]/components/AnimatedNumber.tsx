"use client";

import { animate, useInView, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedNumberProps {
  value: number;
  format: (n: number) => string;
  className?: string;
}

export function AnimatedNumber({ value, format, className }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const formatRef = useRef(format);
  formatRef.current = format;

  const motionValue = useMotionValue(0);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    const unsubscribe = motionValue.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = formatRef.current(v);
      }
    });
    return unsubscribe;
  }, [motionValue]);

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, { duration: 1, ease: "easeOut" });
      return () => controls.stop();
    }
  }, [isInView, value, motionValue]);

  return <span ref={ref} className={className}>{format(0)}</span>;
}
