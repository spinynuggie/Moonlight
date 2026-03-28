import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallBackSrc: string;
  fallBackClassName?: string;
  fadeIn?: boolean;
  [key: string]: any;
}

export default function ImageWithFallback({
  src,
  alt,
  fallBackSrc,
  fallBackClassName,
  fadeIn,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setError(null);
    setLoaded(false);
  }, [src]);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const baseClassName = error
    ? cn(props.className, fallBackClassName)
    : props.className;

  return (
    <Image
      src={error ? fallBackSrc : src}
      alt={alt}
      onError={(e: any) => setError(e)}
      onLoad={handleLoad}
      {...props}
      className={cn(
        baseClassName,
        fadeIn && "transition-opacity duration-500",
        fadeIn && !loaded && "opacity-0",
      )}
    />
  );
}
