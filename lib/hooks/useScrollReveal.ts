import { useEffect } from "react";

export function useScrollReveal(deps: React.DependencyList = []) {
  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-reveal:not(.visible)");
    if (elements.length === 0)
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        const newlyVisible = entries.filter(e => e.isIntersecting);
        newlyVisible.forEach((entry, index) => {
          const el = entry.target as HTMLElement;
          const hasExplicitDelay = Array.from(el.classList).some(c =>
            c.startsWith("scroll-reveal-delay"),
          );
          if (!hasExplicitDelay && newlyVisible.length > 1) {
            el.style.animationDelay = `${index * 100}ms`;
          }
          el.classList.add("visible");
          observer.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- caller controls re-observation deps
  }, deps);
}
