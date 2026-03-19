"use client";
import type { ReactNode } from "react";
import { createContext, useEffect, useRef, useState } from "react";

interface AudioContextType {
  playerRef: React.RefObject<HTMLAudioElement | null>;
  currentTimestamp: number;
  isPlayingThis: (audio: string) => boolean;
  play: (url?: string) => void;
  pause: () => void;
  isPlaying: boolean;
}

export const AudioContext = createContext<AudioContextType | undefined>(
  undefined,
);

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);
  const [volume, _setVolume] = useState<number>(0.4);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<HTMLAudioElement | null>(null); 

  const play = (url?: string) => {
    if (!playerRef.current)
      return;

    if (!url || url === playerRef.current.src) {
      playerRef.current.play();
      setIsPlaying(true);
      return;
    }

    playerRef.current.src = url;

    pause();

    playerRef.current.oncanplay = () => {
      if (!playerRef.current)
        return;

      playerRef.current.volume = volume;
      playerRef.current.play();
      setIsPlaying(true);
    };
  };

  const pause = () => {
    if (!playerRef.current)
      return;
    playerRef.current.pause();
    setIsPlaying(false);
  };

  const isPlayingThis = (audio: string) => {
    return (playerRef.current?.src.includes(audio) && !playerRef.current.paused) || false;
  };

  useEffect(() => {
    if (!playerRef.current)
      return;

    const player = playerRef.current;

    player.onplay = () => setIsPlaying(true);
    player.onpause = () => setIsPlaying(false);
    player.ontimeupdate = () => setCurrentTimestamp(player.currentTime || 0);

    return () => {
      player.onplay = null;
      player.onpause = null;
      player.ontimeupdate = null;
    };
  }, []); // use empty deps array

  return (
    <AudioContext
      value={{
        playerRef,
        isPlayingThis,
        play,
        pause,
        currentTimestamp,
        isPlaying,
      }}
    >
      {children}
      <audio ref={playerRef} onEnded={() => setIsPlaying(false)} />
    </AudioContext>
  );
};
