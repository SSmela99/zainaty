"use client";

import { DownloadIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { formatAuthErrorMessage } from "@/components/auth/auth-page.utils";
import { cn } from "@/lib/utils";

import { accountPageContent } from "./account-page.utils";

type CourseFileDownloadButtonProps = {
  courseId: string;
  fileId: string;
  className?: string;
};

export function CourseFileDownloadButton({
  courseId,
  fileId,
  className,
}: CourseFileDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleDownload() {
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/courses/${courseId}/files/${fileId}/url`,
      );
      const payload = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !payload.url) {
        toast.error(
          payload.error
            ? formatAuthErrorMessage(payload.error)
            : accountPageContent.download.error,
        );
        return;
      }

      window.open(payload.url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error(accountPageContent.download.error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isLoading}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-[#f24a00] px-4 py-2 text-sm font-bold text-[#f24a00] transition-transform hover:-translate-y-0.5 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 dark:border-[#daff02] dark:text-[#daff02]",
        className,
      )}
    >
      <DownloadIcon className="size-4" strokeWidth={2.2} />
      {isLoading
        ? accountPageContent.download.loading
        : accountPageContent.download.label}
    </button>
  );
}
