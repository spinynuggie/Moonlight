import { useCallback, useEffect, useRef, useState } from "react";

export default function BackgroundVideo({
  urls,
  className,
}: {
  urls: string[];
  className: string;
}) {
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getRandomVideo = useCallback((exclude: string | null): string => {
    const filteredArray = urls.filter(v => exclude !== v);
    return filteredArray[Math.floor(Math.random() * filteredArray.length)];
  }, [urls]);

  useEffect(() => {
    if (currentVideo == null) {
      setCurrentVideo(getRandomVideo(null));
    }
  }, [currentVideo, getRandomVideo]);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !currentVideo)
      return;

    const handleEnded = () => {
      setIsVisible(false);

      fadeTimeoutRef.current = setTimeout(() => {
        setCurrentVideo(prev => getRandomVideo(prev));
        fadeTimeoutRef.current = null;
      }, 600);
    };

    videoEl.src = currentVideo;
    videoEl.load();

    videoEl.addEventListener("ended", handleEnded);
    return () => {
      videoEl.removeEventListener("ended", handleEnded);
    };
  }, [currentVideo, getRandomVideo]);

  useEffect(() => {
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  const handleVideoLoad = () => {
    const videoEl = videoRef.current;
    if (videoEl) {
      videoEl.play().catch(() => {});
      setIsVisible(true);
    }
  };

  return (
    <video
      ref={videoRef}
      onLoadedData={handleVideoLoad}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.6s ease-in-out",
      }}
      muted
      playsInline
    />
  );
}
