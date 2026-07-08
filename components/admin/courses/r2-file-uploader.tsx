"use client";

import { UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import type { CourseKind } from "@/lib/courses/kinds";
import { uploadVideoToR2 } from "@/lib/r2/upload.client";
import { cn } from "@/lib/utils";

const VIDEO_ACCEPT = "video/mp4,video/webm,video/quicktime,video/x-msvideo";
const FILE_ACCEPT = ".pdf,application/pdf";

type R2FileUploaderProps = {
  courseSlug: string;
  kind?: CourseKind;
  disabled?: boolean;
  onUploaded: (objectKey: string, filename: string) => void;
};

export function R2FileUploader({
  courseSlug,
  kind = "video",
  disabled = false,
  onUploaded,
}: R2FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const isVideo = kind === "video";

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
    toast.success("Plik wgrany do R2.");
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={isVideo ? VIDEO_ACCEPT : FILE_ACCEPT}
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
        {isUploading
          ? `Wgrywanie… ${progress}%`
          : isVideo
            ? "Wybierz i wgraj wideo"
            : "Wybierz i wgraj plik"}
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

      {!courseSlug.trim() ? (
        <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
          Najpierw podaj nazwę (slug) kursu, aby wgrać plik.
        </p>
      ) : null}

      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        {isVideo
          ? "MP4, WebM lub MOV — plik trafia bezpośrednio do Cloudflare R2 (bez limitu 300 MB z panelu)."
          : "Plik PDF — trafia bezpośrednio do Cloudflare R2. Klucz uzupełni się automatycznie."}
      </p>
    </div>
  );
}
