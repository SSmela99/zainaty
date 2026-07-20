"use client";

import Image from "next/image";
import { PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { FreeMaterial } from "@/lib/free-materials/types";

type FreeMaterialsListProps = {
  items: FreeMaterial[];
  disabled?: boolean;
  onEdit: (item: FreeMaterial) => void;
  onDelete: (item: FreeMaterial) => void;
};

export function FreeMaterialsList({
  items,
  disabled = false,
  onEdit,
  onDelete,
}: FreeMaterialsListProps) {
  return (
    <ul className="mt-4 divide-y divide-[#ddd8ce] dark:divide-zinc-800">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 items-start gap-4">
            {item.cover_image_url ? (
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#f1eee5] dark:bg-[#151414]">
                <Image
                  src={item.cover_image_url}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#ffd0bc] text-xs font-black text-[#f24a00] dark:bg-[#3a4500] dark:text-[#daff02]">
                {(item.tag?.name ?? "—").slice(0, 4)}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-sm font-black text-zinc-950 dark:text-white">
                  {item.title}
                </h3>
                {item.tag ? (
                  <span className="rounded-full bg-[#ffd0bc] px-2 py-0.5 text-[11px] font-bold text-[#f24a00] dark:bg-[#3a4500] dark:text-[#daff02]">
                    {item.tag.name}
                  </span>
                ) : null}
                {item.is_video ? (
                  <span className="rounded-full bg-[#dfe5ff] px-2 py-0.5 text-[11px] font-bold text-[#0033ff] dark:bg-[#1a2a5e] dark:text-[#6688ff]">
                    Wideo
                  </span>
                ) : null}
                {!item.published ? (
                  <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[11px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    Szkic
                  </span>
                ) : null}
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                {item.description}
              </p>
              {item.is_video && item.youtube_url ? (
                <p className="mt-1 truncate text-xs text-zinc-500">
                  YT: {item.youtube_url}
                </p>
              ) : null}
              {!item.is_video && item.file_name ? (
                <p className="mt-1 truncate text-xs text-zinc-500">
                  Plik: {item.file_name}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 gap-2 self-end sm:self-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              className="h-9 rounded-xl"
              onClick={() => onEdit(item)}
            >
              <PencilIcon className="size-3.5" />
              Edytuj
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              className="h-9 rounded-xl text-red-600 hover:text-red-700 dark:text-red-400"
              onClick={() => onDelete(item)}
            >
              <Trash2Icon className="size-3.5" />
              Usuń
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
