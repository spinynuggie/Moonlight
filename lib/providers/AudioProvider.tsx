"use client";
import type { ReactNode } from "react";
import { createContext, useCallback, useEffect, useRef, useState } from "react";

export interface AudioTrackMetadata {
  id: number;
  title: string;
  artist: string;
}

interface AudioContextType {
  playerRef: React.RefObject<HTMLAudioElement | null>;
  currentTimestamp: number;
  duration: number;
  isPlayingThis: (audio: string) => boolean;
  play: (url?: string, metadata?: AudioTrackMetadata) => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  isPlaying: boolean;
  currentTrack: AudioTrackMetadata | null;
  volume: number;
  setVolume: (v: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

export const AudioContext = createContext<AudioContextType | undefined>(
  undefined,
);

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrackMetadata | null>(null);
  const playerRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef(0.4);
  const isMutedRef = useRef(false);

  const play = useCallback((url?: string, metadata?: AudioTrackMetadata) => {
    if (!playerRef.current)
      return;

    if (metadata) {
      setCurrentTrack(metadata);
    }

    if (!url || url === playerRef.current.src) {
      playerRef.current.play();
      setIsPlaying(true);
      return;
    }

    playerRef.current.src = url;
    playerRef.current.pause();
    setIsPlaying(false);

    playerRef.current.oncanplay = () => {
      if (!playerRef.current)
        return;

      playerRef.current.oncanplay = null;
      playerRef.current.volume = isMutedRef.current ? 0 : volumeRef.current;
      playerRef.current.play();
      setIsPlaying(true);
    };
  }, []);

  const pause = useCallback(() => {
    if (!playerRef.current)
      return;
    playerRef.current.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    if (!playerRef.current)
      return;
    playerRef.current.oncanplay = null;
    playerRef.current.pause();
    playerRef.current.removeAttribute("src");
    playerRef.current.load();
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentTimestamp(0);
    setDuration(0);
  }, []);

  const seek = useCallback((time: number) => {
    if (!playerRef.current)
      return;
    playerRef.current.currentTime = time;
    setCurrentTimestamp(time);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    volumeRef.current = v;
    if (playerRef.current) {
      playerRef.current.volume = v;
    }
    if (v > 0) {
      setIsMuted(false);
      isMutedRef.current = false;
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!playerRef.current)
      return;
    if (isMutedRef.current) {
      playerRef.current.volume = volumeRef.current;
      setIsMuted(false);
      isMutedRef.current = false;
    }
    else {
      playerRef.current.volume = 0;
      setIsMuted(true);
      isMutedRef.current = true;
    }
  }, []);

  const isPlayingThis = useCallback((audio: string) => {
    return (playerRef.current?.src.includes(audio) && !playerRef.current.paused) || false;
  }, []);

  useEffect(() => {
    if (!playerRef.current)
      return;
    const player = playerRef.current;

    player.onplay = () => setIsPlaying(true);
    player.onpause = () => setIsPlaying(false);
    player.ontimeupdate = () => setCurrentTimestamp(player.currentTime || 0);
    player.ondurationchange = () => {
      if (player.duration && Number.isFinite(player.duration)) {
        setDuration(player.duration);
      }
    };

    return () => {
      player.onplay = null;
      player.onpause = null;
      player.ontimeupdate = null;
      player.ondurationchange = null;
    };
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    if (playerRef.current) {
      playerRef.current.oncanplay = null;
      playerRef.current.currentTime = 0;
      setCurrentTimestamp(0);
    }
  }, []);

  return (
    <AudioContext
      value={{
        playerRef,
        isPlayingThis,
        play,
        pause,
        stop,
        seek,
        currentTimestamp,
        duration,
        isPlaying,
        currentTrack,
        volume,
        setVolume,
        isMuted,
        toggleMute,
      }}
    >
      {children}
      <audio ref={playerRef} onEnded={handleEnded} />
    </AudioContext>
  );
};
