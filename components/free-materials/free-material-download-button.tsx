"use client";

import { DownloadIcon, Loader2Icon, PlayIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import type { PublicFreeMaterial } from "@/lib/free-materials/types";

import { getDownloadCtaLabel } from "./free-materials.utils";

type FreeMaterialDownloadButtonProps = {
  material: PublicFreeMaterial;
  className?: string;
  variant?: "link" | "button";
};

export function FreeMaterialDownloadButton({
  material,
  className,
  variant = "link",
}: FreeMaterialDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const label = getDownloadCtaLabel(material);
  const Icon = material.is_video ? PlayIcon : DownloadIcon;

  async function handleClick(event: React.MouseEvent) {
    event.stopPropagation();

    if (material.is_video) {
      if (!material.youtube_url) {
        toast.error("Brak linku do wideo.");
        return;
      }
      window.open(material.youtube_url, "_blank", "noopener,noreferrer");
      return;
    }

    if (!material.has_download) {
      toast.error("Plik nie jest jeszcze dostępny.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/free-materials/${material.id}/download`);
      const payload = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !payload.url) {
        toast.error(payload.error ?? "Nie udało się pobrać pliku.");
        return;
      }

      window.open(payload.url, "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Nie udało się pobrać pliku.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        variant === "link" &&
          "text-zinc-400 hover:text-[#f24a00] dark:text-zinc-500 dark:hover:text-[#daff02]",
        variant === "button" &&
          "rounded-xl bg-[#f24a00] px-4 py-2.5 text-white hover:bg-[#d94200] dark:bg-[#daff02] dark:text-zinc-950 dark:hover:bg-[#9bec00]",
        className,
      )}
    >
      {isLoading ? (
        <Loader2Icon className="size-4 animate-spin" strokeWidth={2.2} />
      ) : (
        <Icon className="size-4" strokeWidth={2.2} />
      )}
      {isLoading ? "Pobieranie…" : label}
    </button>
  );
}
