import { useEffect, useRef } from "react";

export function useInfiniteScroll(
  canLoadMore: boolean,
  isLoading: boolean,
  onLoadMore: () => void,
) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const callbackRef = useRef(onLoadMore);
  callbackRef.current = onLoadMore;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !canLoadMore || isLoading)
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callbackRef.current();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [canLoadMore, isLoading]);

  return sentinelRef;
}
