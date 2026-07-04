"use client";

import { UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { CourseKind } from "@/lib/courses/kinds";
import { uploadVideoToR2 } from "@/lib/r2/upload.client";
import { cn } from "@/lib/utils";

const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime,video/x-msvideo";

type R2VideoUploaderProps = {
  courseSlug: string;
  kind?: CourseKind;
  disabled?: boolean;
  onUploaded: (objectKey: string, filename: string) => void;
};

export function R2VideoUploader({
  courseSlug,
  kind = "video",
  disabled = false,
  onUploaded,
}: R2VideoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!courseSlug.trim()) {
      toast.error("Najpierw podaj slug kursu.");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    const result = await uploadVideoToR2({
      file,
      courseSlug,
      kind,
      onProgress: setProgress,
    });

    setIsUploading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    onUploaded(result.objectKey, file.name);
    toast.success("Wideo wgrane do R2.");
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={VIDEO_ACCEPT}
        className="hidden"
        disabled={disabled || isUploading}
        onChange={handleFileChange}
      />

      <Button
        type="button"
        variant="outline"
        disabled={disabled || isUploading || !courseSlug.trim()}
        onClick={() => inputRef.current?.click()}
        className="h-10 w-full rounded-xl"
      >
        <UploadIcon className="size-4" />
        {isUploading ? `Wgrywanie… ${progress}%` : "Wybierz i wgraj wideo"}
      </Button>

      {isUploading ? (
        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className={cn(
              "h-full rounded-full bg-[#ff4b12] transition-[width] duration-200 dark:bg-[#d7ff00]",
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        MP4, WebM lub MOV — plik trafia bezpośrednio do Cloudflare R2 (bez limitu
        300 MB z panelu).
      </p>
    </div>
  );
}
