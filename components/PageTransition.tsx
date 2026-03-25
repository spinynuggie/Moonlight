"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [transitionKey, setTransitionKey] = useState(0);
  const prevRouteBase = useRef(getRouteBase(pathname));

  useEffect(() => {
    const currentBase = getRouteBase(pathname);
    if (currentBase !== prevRouteBase.current) {
      prevRouteBase.current = currentBase;
      setTransitionKey(k => k + 1);
    }
  }, [pathname]);

  return (
    <div
      key={transitionKey}
      className="page-transition"
    >
      {children}
    </div>
  );
}

function getRouteBase(pathname: string) {
  return pathname.split("/").slice(0, 3).join("/");
}
