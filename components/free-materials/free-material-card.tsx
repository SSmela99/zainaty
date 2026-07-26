"use client";

import Image from "next/image";
import { SearchIcon } from "lucide-react";

import type { PublicFreeMaterial } from "@/lib/free-materials/types";

import { FreeMaterialDownloadButton } from "./free-material-download-button";
import { getMaterialBadge } from "./free-materials.utils";

type FreeMaterialCardProps = {
  material: PublicFreeMaterial;
  onOpen: (material: PublicFreeMaterial) => void;
};

export function FreeMaterialCard({ material, onOpen }: FreeMaterialCardProps) {
  const badge = getMaterialBadge(material);
  const BadgeIcon = badge.Icon;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#ddd8ce] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.1)] dark:border-[#282828] dark:bg-[#151414] dark:hover:shadow-[0_24px_56px_rgba(0,0,0,0.45)]">
      <button
        type="button"
        onClick={() => onOpen(material)}
        className="relative aspect-[4/5] w-full cursor-pointer overflow-hidden bg-[#f1eee5] text-left dark:bg-[#1c1c1c]"
      >
        {material.cover_image_url ? (
          <Image
            src={material.cover_image_url}
            alt={material.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-2xl font-black tracking-[0.02em] text-[#f24a00] dark:text-[#daff02]">
            {material.title}
          </div>
        )}

        <span
          className={`absolute top-3.5 left-3.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm ${badge.className}`}
        >
          <BadgeIcon className="size-3" strokeWidth={2.5} />
          {badge.label}
        </span>

        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-zinc-950/0 opacity-0 transition-all duration-300 group-hover:bg-zinc-950/45 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-zinc-950 shadow-lg">
            <SearchIcon className="size-4" strokeWidth={2.4} />
            Zobacz szczegóły
          </span>
        </span>
      </button>

      <div className="flex flex-1 flex-col px-5 pt-5 pb-5 md:px-6">
        <button
          type="button"
          onClick={() => onOpen(material)}
          className="cursor-pointer text-left"
        >
          <h2 className="text-lg leading-snug font-black tracking-[0.02em] text-zinc-950 transition-colors group-hover:text-[#f24a00] dark:text-white dark:group-hover:text-[#daff02]">
            {material.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {material.description}
          </p>
        </button>

        <div className="mt-auto border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <FreeMaterialDownloadButton material={material} variant="link" />
        </div>
      </div>
    </article>
  );
}
