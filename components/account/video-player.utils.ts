export const VIDEO_PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;

export const PLAYBACK_SPEED_STORAGE_KEY = "zaintaty-video-playback-rate";
export const VOLUME_STORAGE_KEY = "zaintaty-video-volume";
export const MUTED_STORAGE_KEY = "zaintaty-video-muted";

export function formatVideoTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

export function formatPlaybackSpeedLabel(speed: number): string {
  if (speed === 1) {
    return "1×";
  }

  return `${speed.toString().replace(".", ",")}×`;
}

export function getStoredPlaybackRate(): number {
  if (typeof window === "undefined") {
    return 1;
  }

  const stored = window.localStorage.getItem(PLAYBACK_SPEED_STORAGE_KEY);
  const parsed = stored ? Number.parseFloat(stored) : 1;

  if (!(VIDEO_PLAYBACK_SPEEDS as readonly number[]).includes(parsed)) {
    return 1;
  }

  return parsed;
}

export function storePlaybackRate(rate: number) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PLAYBACK_SPEED_STORAGE_KEY, String(rate));
}

export function getStoredVolume(): number {
  if (typeof window === "undefined") {
    return 1;
  }

  const stored = window.localStorage.getItem(VOLUME_STORAGE_KEY);
  const parsed = stored ? Number.parseFloat(stored) : 1;

  if (!Number.isFinite(parsed)) {
    return 1;
  }

  return Math.min(1, Math.max(0, parsed));
}

export function storeVolume(volume: number) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(VOLUME_STORAGE_KEY, String(volume));
}

export function getStoredMuted(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(MUTED_STORAGE_KEY) === "1";
}

export function storeMuted(muted: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(MUTED_STORAGE_KEY, muted ? "1" : "0");
}
