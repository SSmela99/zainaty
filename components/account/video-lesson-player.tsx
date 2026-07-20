"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { formatAuthErrorMessage } from "@/components/auth/auth-page.utils";
import { accountPageContent } from "@/components/account/account-page.utils";
import { VideoPlayer } from "@/components/account/video-player";
import { cn } from "@/lib/utils";

type VideoLessonPlayerProps = {
  courseId: string;
  fileId: string;
  title: string;
  description?: string | null;
  className?: string;
};

export function VideoLessonPlayer({
  courseId,
  fileId,
  title,
  description,
  className,
}: VideoLessonPlayerProps) {
  const content = accountPageContent.courses.videoPlayer;
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadVideoUrl() {
      setIsLoading(true);
      setVideoUrl(null);

      try {
        const response = await fetch(
          `/api/courses/${courseId}/files/${fileId}/url`,
        );
        const payload = (await response.json()) as {
          url?: string;
          error?: string;
        };

        if (cancelled) {
          return;
        }

        if (!response.ok || !payload.url) {
          toast.error(
            payload.error
              ? formatAuthErrorMessage(payload.error)
              : content.videoError,
          );
          return;
        }

        setVideoUrl(payload.url);
      } catch {
        if (!cancelled) {
          toast.error(content.videoError);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadVideoUrl();

    return () => {
      cancelled = true;
    };
  }, [courseId, fileId, content.videoError]);

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="overflow-hidden rounded-2xl bg-black shadow-[0_16px_48px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.45)]">
        {isLoading ? (
          <div className="flex aspect-video items-center justify-center text-sm font-semibold text-zinc-300">
            {content.loadingVideo}
          </div>
        ) : videoUrl ? (
          <VideoPlayer
            key={videoUrl}
            src={videoUrl}
            title={title}
            speedLabel={content.speedLabel}
          />
        ) : (
          <div className="flex aspect-video items-center justify-center px-6 text-center text-sm text-zinc-400">
            {content.videoError}
          </div>
        )}
      </div>

      {description ? (
        <div className="rounded-3xl border border-[#ddd8ce] bg-[#f5f2e9]/50 px-5 py-5 md:px-6 md:py-6 dark:border-[#282828] dark:bg-[#151414]/80">
          <p className="text-xs font-black tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
            O tej lekcji
          </p>
          <p className="mt-3 text-sm leading-7 text-zinc-700 md:text-base dark:text-zinc-300">
            {description}
          </p>
        </div>
      ) : null}
    </div>
  );
}
