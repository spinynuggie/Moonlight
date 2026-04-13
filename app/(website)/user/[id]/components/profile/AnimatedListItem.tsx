"use client";

import { useEffect, useRef } from "react";

export function useStaggerAnimation(itemCount: number): number {
  const hasHadItemsRef = useRef(itemCount > 0);
  const prevCountRef = useRef(itemCount);

  useEffect(() => {
    if (itemCount > 0)
      hasHadItemsRef.current = true;
    prevCountRef.current = itemCount;
  }, [itemCount]);

  if (!hasHadItemsRef.current && itemCount > 0)
    return 0;
  if (itemCount > prevCountRef.current)
    return prevCountRef.current;
  return -1;
}

interface AnimatedListItemProps {
  children: React.ReactNode;
  index: number;
  animateFrom: number;
}

export function AnimatedListItem({
  children,
  index,
  animateFrom,
}: AnimatedListItemProps) {
  const shouldAnimate = animateFrom >= 0 && index >= animateFrom;
  const staggerIndex = shouldAnimate ? index - animateFrom : 0;

  return (
    <div
      className={shouldAnimate ? "profile-item-enter" : undefined}
      style={shouldAnimate ? { animationDelay: `${staggerIndex * 80}ms` } : undefined}
    >
      {children}
    </div>
  );
}
