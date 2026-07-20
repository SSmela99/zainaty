"use client";

import { Gauge, Maximize, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

import {
  formatPlaybackSpeedLabel,
  formatVideoTime,
  getStoredPlaybackRate,
  storePlaybackRate,
  VIDEO_PLAYBACK_SPEEDS,
} from "./video-player.utils";

type VideoPlayerProps = {
  src: string;
  title: string;
  className?: string;
  speedLabel?: string;
};

export function VideoPlayer({
  src,
  title,
  className,
  speedLabel = "Prędkość",
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [playbackRate, setPlaybackRate] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const applyPlaybackRate = useCallback((rate: number) => {
    const video = videoRef.current;

    if (video) {
      video.playbackRate = rate;
    }

    setPlaybackRate(rate);
    storePlaybackRate(rate);
  }, []);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    applyPlaybackRate(getStoredPlaybackRate());
  }, [src, applyPlaybackRate]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    function handleLoadedMetadata() {
      const element = videoRef.current;

      if (!element) {
        return;
      }

      setDuration(element.duration);
      element.playbackRate = playbackRate;
    }

    function handleTimeUpdate() {
      const element = videoRef.current;

      if (!element) {
        return;
      }

      setCurrentTime(element.currentTime);
    }

    function handlePlay() {
      setIsPlaying(true);
    }

    function handlePause() {
      setIsPlaying(false);
    }

    function handleEnded() {
      setIsPlaying(false);
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [src, playbackRate]);

  function togglePlay() {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      void video.play();
      return;
    }

    video.pause();
  }

  function handleSeek(value: number) {
    const video = videoRef.current;

    if (!video || !Number.isFinite(duration)) {
      return;
    }

    video.currentTime = value;
    setCurrentTime(value);
  }

  async function toggleFullscreen() {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await container.requestFullscreen();
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      className={cn(
        "group/video relative aspect-video w-full overflow-hidden bg-black",
        className,
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(isPlaying ? false : true)}
      onFocusCapture={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        key={src}
        src={src}
        playsInline
        className="h-full w-full bg-black"
        title={title}
        onClick={togglePlay}
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/90 via-black/55 to-transparent px-3 pb-3 pt-10 transition-opacity duration-200 md:px-4 md:pb-4",
          showControls ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="pointer-events-auto flex flex-col gap-2">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={(event) => handleSeek(Number(event.target.value))}
            aria-label="Postęp odtwarzania"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/25 accent-[#f24a00] [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            style={{
              background: `linear-gradient(to right, #f24a00 0%, #f24a00 ${progress}%, rgba(255,255,255,0.25) ${progress}%, rgba(255,255,255,0.25) 100%)`,
            }}
          />

          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={togglePlay}
                className="text-white hover:bg-white/15 hover:text-white"
                aria-label={isPlaying ? "Pauza" : "Odtwórz"}
              >
                {isPlaying ? (
                  <Pause className="size-4" />
                ) : (
                  <Play className="size-4" />
                )}
              </Button>

              <span className="truncate text-xs font-medium text-white/90 tabular-nums">
                {formatVideoTime(currentTime)} / {formatVideoTime(duration)}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1.5 px-2 text-xs font-semibold text-white hover:bg-white/15 hover:text-white"
                    />
                  }
                >
                  <Gauge className="size-3.5" />
                  {formatPlaybackSpeedLabel(playbackRate)}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-36">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>{speedLabel}</DropdownMenuLabel>
                    <DropdownMenuRadioGroup
                      value={String(playbackRate)}
                      onValueChange={(value) =>
                        applyPlaybackRate(Number.parseFloat(value))
                      }
                    >
                      {VIDEO_PLAYBACK_SPEEDS.map((speed) => (
                        <DropdownMenuRadioItem
                          key={speed}
                          value={String(speed)}
                        >
                          {formatPlaybackSpeedLabel(speed)}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => void toggleFullscreen()}
                className="text-white hover:bg-white/15 hover:text-white"
                aria-label="Pełny ekran"
              >
                <Maximize className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
