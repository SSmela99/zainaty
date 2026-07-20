"use client";

import Image from "next/image";
import { XIcon } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PublicFreeMaterial } from "@/lib/free-materials/types";

import { FreeMaterialDownloadButton } from "./free-material-download-button";
import {
  getMaterialBadge,
  getYouTubeEmbedUrl,
} from "./free-materials.utils";

type FreeMaterialDialogProps = {
  material: PublicFreeMaterial | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FreeMaterialDialog({
  material,
  open,
  onOpenChange,
}: FreeMaterialDialogProps) {
  if (!material) return null;

  const badge = getMaterialBadge(material);
  const BadgeIcon = badge.Icon;
  const embedUrl = material.is_video
    ? getYouTubeEmbedUrl(material.youtube_url)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[min(92vh,900px)] gap-0 overflow-y-auto rounded-[1.75rem] border-0 bg-white p-0 shadow-2xl ring-0 sm:max-w-2xl dark:bg-[#151414]"
      >
        <DialogClose className="absolute top-4 right-4 z-20 flex size-10 cursor-pointer items-center justify-center rounded-full bg-zinc-950/70 text-white outline-none transition-colors hover:bg-zinc-950 focus-visible:ring-2 focus-visible:ring-white/40">
          <XIcon className="size-5" strokeWidth={2.5} />
          <span className="sr-only">Zamknij</span>
        </DialogClose>

        {embedUrl ? (
          <div className="relative aspect-video overflow-hidden bg-zinc-950">
            <iframe
              title={material.title}
              src={embedUrl}
              className="absolute inset-0 size-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="relative aspect-[16/11] overflow-hidden bg-[#f1eee5] dark:bg-[#1c1c1c]">
            {material.cover_image_url ? (
              <Image
                src={material.cover_image_url}
                alt={material.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : null}

            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-zinc-950 via-zinc-950/55 to-transparent"
            />

            <div className="absolute inset-x-0 bottom-0 p-6 pt-16 text-white">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${badge.className}`}
              >
                <BadgeIcon className="size-3" strokeWidth={2.5} />
                {badge.label}
              </span>
              <DialogTitle className="mt-3 text-left text-2xl leading-tight font-black tracking-[-0.02em] text-white">
                {material.title}
              </DialogTitle>
            </div>
          </div>
        )}

        <div className="bg-white px-6 pt-5 pb-6 dark:bg-[#151414]">
          {embedUrl ? (
            <>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${badge.className}`}
              >
                <BadgeIcon className="size-3" strokeWidth={2.5} />
                {badge.label}
              </span>
              <DialogTitle className="mt-3 text-left text-2xl leading-tight font-black tracking-[-0.02em] text-zinc-950 dark:text-white">
                {material.title}
              </DialogTitle>
            </>
          ) : null}

          <DialogDescription
            className={
              embedUrl
                ? "mt-3 text-left text-sm leading-7 text-zinc-600 dark:text-zinc-300"
                : "text-left text-sm leading-7 text-zinc-600 dark:text-zinc-300"
            }
          >
            {material.description}
          </DialogDescription>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <FreeMaterialDownloadButton
              material={material}
              variant="button"
            />
            <DialogClose className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-zinc-300 px-4 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800">
              <XIcon className="size-4" strokeWidth={2.4} />
              Zamknij
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
