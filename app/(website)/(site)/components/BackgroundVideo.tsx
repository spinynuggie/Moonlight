import { useCallback, useEffect, useRef } from "react";

export default function BackgroundVideo({
  urls,
}: {
  urls: string[];
}) {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const activeSlotRef = useRef<0 | 1>(0);
  const initializedRef = useRef(false);

  const getRandomVideo = useCallback(
    (exclude: string | null): string => {
      const filtered = urls.filter(v => v !== exclude);
      return filtered[Math.floor(Math.random() * filtered.length)];
    },
    [urls],
  );

  useEffect(() => {
    if (initializedRef.current)
      return;
    initializedRef.current = true;

    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    if (!videoA || !videoB)
      return;

    let currentSrc: string | null = null;

    const loadAndPlay = (video: HTMLVideoElement, url: string) => {
      currentSrc = url;
      video.src = url;
      video.load();
    };

    const handleLoadedA = () => {
      videoA.play().catch(() => {});
      videoA.style.opacity = "1";
      videoB.style.opacity = "0";
      activeSlotRef.current = 0;
    };

    const handleLoadedB = () => {
      videoB.play().catch(() => {});
      videoB.style.opacity = "1";
      videoA.style.opacity = "0";
      activeSlotRef.current = 1;
    };

    const handleEndedA = () => {
      if (activeSlotRef.current !== 0)
        return;
      const nextUrl = getRandomVideo(currentSrc);
      currentSrc = nextUrl;
      videoB.src = nextUrl;
      videoB.load();
    };

    const handleEndedB = () => {
      if (activeSlotRef.current !== 1)
        return;
      const nextUrl = getRandomVideo(currentSrc);
      currentSrc = nextUrl;
      videoA.src = nextUrl;
      videoA.load();
    };

    videoA.addEventListener("loadeddata", handleLoadedA);
    videoB.addEventListener("loadeddata", handleLoadedB);
    videoA.addEventListener("ended", handleEndedA);
    videoB.addEventListener("ended", handleEndedB);

    const firstUrl = getRandomVideo(null);
    loadAndPlay(videoA, firstUrl);

    return () => {
      videoA.removeEventListener("loadeddata", handleLoadedA);
      videoB.removeEventListener("loadeddata", handleLoadedB);
      videoA.removeEventListener("ended", handleEndedA);
      videoB.removeEventListener("ended", handleEndedB);
    };
  }, [getRandomVideo]);

  return (
    <div className="relative size-full">
      <video
        ref={videoARef}
        className="absolute inset-0 size-full object-cover"
        style={{ opacity: 0, transition: "opacity 1s ease-in-out" }}
        muted
        playsInline
      />
      <video
        ref={videoBRef}
        className="absolute inset-0 size-full object-cover"
        style={{ opacity: 0, transition: "opacity 1s ease-in-out" }}
        muted
        playsInline
      />
    </div>
  );
}
