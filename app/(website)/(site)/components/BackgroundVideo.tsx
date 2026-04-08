import { memo, useEffect, useRef } from "react";

const BackgroundVideo = memo(function BackgroundVideo({
  urls,
}: {
  urls: string[];
}) {
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    const videoA = videoARef.current;
    const videoB = videoBRef.current;
    if (!videoA || !videoB || urls.length === 0)
      return;
    if (mountedRef.current)
      return;
    mountedRef.current = true;

    let currentIndex = 0;
    let active = videoA;
    let standby = videoB;
    let pendingCanplay: (() => void) | null = null;

    const preloadNext = () => {
      const nextIndex = (currentIndex + 1) % urls.length;
      standby.src = urls[nextIndex];
      standby.load();
    };

    const crossfade = () => {
      standby.play().catch(() => {});
      standby.style.opacity = "1";
      active.style.opacity = "0";

      const prev = active;
      active = standby;
      standby = prev;

      setTimeout(preloadNext, 1000);
    };

    const onEnded = () => {
      currentIndex = (currentIndex + 1) % urls.length;

      if (standby.readyState >= 3) {
        crossfade();
      }
      else {
        const handler = () => {
          pendingCanplay = null;
          crossfade();
        };
        pendingCanplay = handler;
        standby.addEventListener("canplay", handler, { once: true });
      }
    };

    const onFirstReady = () => {
      videoA.removeEventListener("canplay", onFirstReady);
      videoA.play().catch(() => {});
      videoA.style.opacity = "1";
      preloadNext();
    };

    videoA.addEventListener("canplay", onFirstReady);
    videoA.addEventListener("ended", onEnded);
    videoB.addEventListener("ended", onEnded);

    videoA.src = urls[0];
    videoA.load();

    return () => {
      videoA.removeEventListener("canplay", onFirstReady);
      videoA.removeEventListener("ended", onEnded);
      videoB.removeEventListener("ended", onEnded);
      if (pendingCanplay) {
        videoA.removeEventListener("canplay", pendingCanplay);
        videoB.removeEventListener("canplay", pendingCanplay);
      }
      mountedRef.current = false;
    };
  }, [urls]);

  return (
    <div className="relative size-full">
      <video
        ref={videoARef}
        className="absolute inset-0 size-full object-cover"
        style={{ opacity: 0, transition: "opacity 1s ease-in-out" }}
        muted
        playsInline
        preload="auto"
      />
      <video
        ref={videoBRef}
        className="absolute inset-0 size-full object-cover"
        style={{ opacity: 0, transition: "opacity 1s ease-in-out" }}
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
});

export default BackgroundVideo;
