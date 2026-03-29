import { Play } from "lucide-react";
import { useEffect, useState } from "react";

import { AudioEqualizer } from "@/components/AudioEqualizer";
import { Button } from "@/components/ui/button";
import useAudioPlayer from "@/lib/hooks/useAudioPlayer";
import type { BeatmapSetResponse } from "@/lib/types/api";
import { cn } from "@/lib/utils";

interface AudioPreviewProps {
  beatmapSet: BeatmapSetResponse;
  className?: string;
}

export default function AudioPreview({
  beatmapSet,
  className,
}: AudioPreviewProps) {
  const { playerRef, isPlaying, isPlayingThis, play, pause } = useAudioPlayer();

  const [isPlayingCurrent, setIsPlayingCurrent] = useState(false);

  useEffect(() => {
    if (!playerRef.current)
      return;
    setIsPlayingCurrent(isPlayingThis(`${beatmapSet.id}.mp3`));
  }, [beatmapSet.id, isPlaying, isPlayingThis, playerRef]);

  return (
    <Button
      size="icon"
      variant="link"
      onClick={() => {
        if (isPlaying && isPlayingCurrent) {
          pause();
          return;
        }

        play(`https://b.ppy.sh/preview/${beatmapSet.id}.mp3`, {
          id: beatmapSet.id,
          title: beatmapSet.title,
          artist: beatmapSet.artist,
        });
      }}
      className={cn(
        "relative min-h-8 min-w-full max-w-64 overflow-hidden rounded-lg bg-opacity-0 px-6 py-1 text-xs text-white hover:bg-opacity-0",
        className,
      )}
    >
      {isPlayingCurrent ? (
        <AudioEqualizer className="h-5 text-primary" />
      ) : (
        <Play className="h-8 fill-white" />
      )}
    </Button>
  );
}
