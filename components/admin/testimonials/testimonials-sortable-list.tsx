"use client";

import Image from "next/image";
import { GripVerticalIcon, PencilIcon, StarIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { reorderTestimonials } from "@/app/admin/actions/testimonials";
import { Button } from "@/components/ui/button";
import { reorderTestimonialList } from "@/lib/testimonials/reorder";
import type { Testimonial } from "@/lib/testimonials/types";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type TestimonialsSortableListProps = {
  items: Testimonial[];
  disabled?: boolean;
  onEdit: (item: Testimonial) => void;
  onDelete: (item: Testimonial) => void;
  onReorderFailed: () => void;
};

export function TestimonialsSortableList({
  items,
  disabled = false,
  onEdit,
  onDelete,
  onReorderFailed,
}: TestimonialsSortableListProps) {
  const [orderedItems, setOrderedItems] = useState(items);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [isReorderPending, startReorderTransition] = useTransition();

  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  function handleDragStart(itemId: string) {
    if (disabled || isReorderPending) return;
    setDraggedId(itemId);
  }

  function handleDragOver(event: React.DragEvent, itemId: string) {
    event.preventDefault();
    if (!draggedId || draggedId === itemId || disabled || isReorderPending) return;
    setDragOverId(itemId);
  }

  function handleDrop(event: React.DragEvent, targetId: string) {
    event.preventDefault();
    if (!draggedId || disabled || isReorderPending) return;

    const nextItems = reorderTestimonialList(orderedItems, draggedId, targetId);
    setOrderedItems(nextItems);
    setDraggedId(null);
    setDragOverId(null);

    startReorderTransition(async () => {
      const result = await reorderTestimonials(nextItems.map((item) => item.id));
      if (!result.ok) {
        toast.error(result.error ?? "Nie udało się zapisać kolejności.");
        onReorderFailed();
        return;
      }

      toast.success("Kolejność zapisana.");
    });
  }

  function handleDragEnd() {
    setDraggedId(null);
    setDragOverId(null);
  }

  return (
    <ul className="mt-6 space-y-3">
      {orderedItems.map((item) => {
        const isDragging = draggedId === item.id;
        const isDropTarget = dragOverId === item.id && draggedId !== item.id;

        return (
          <li
            key={item.id}
            draggable={!disabled && !isReorderPending}
            onDragStart={() => handleDragStart(item.id)}
            onDragOver={(event) => handleDragOver(event, item.id)}
            onDrop={(event) => handleDrop(event, item.id)}
            onDragEnd={handleDragEnd}
            className={cn(
              "flex cursor-grab flex-col gap-4 rounded-2xl border p-4 transition-[border-color,box-shadow,opacity,transform] active:cursor-grabbing md:flex-row md:items-start",
              isDragging
                ? "border-[#f24a00]/40 opacity-60 dark:border-[#daff02]/40"
                : isDropTarget
                  ? "border-[#f24a00] shadow-[0_0_0_1px_rgba(255,75,18,0.25)] dark:border-[#daff02] dark:shadow-[0_0_0_1px_rgba(215,255,0,0.25)]"
                  : "border-zinc-100 dark:border-zinc-800",
            )}
          >
            <div
              aria-hidden
              className="inline-flex size-10 shrink-0 cursor-grab items-center justify-center rounded-xl text-zinc-400 active:cursor-grabbing"
            >
              <GripVerticalIcon className="size-4" strokeWidth={2.2} />
            </div>

            {item.avatar_url ? (
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full border-2 border-[#f24a00]/30 dark:border-[#daff02]/30">
                <Image
                  src={item.avatar_url}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-[#f24a00]/30 bg-[#ffd0bc] text-[10px] font-black text-[#f24a00] dark:border-[#daff02]/30 dark:bg-[#3a4500] dark:text-[#daff02]">
                {getInitials(item.author_name) || "?"}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-zinc-950 dark:text-white">
                  {item.author_name}
                </h3>
                <span className="text-sm text-zinc-500">{item.author_role}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase ${
                    item.published
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {item.published ? "Opublikowana" : "Ukryta"}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-0.5">
                {Array.from({ length: item.rating }).map((_, index) => (
                  <StarIcon
                    key={index}
                    className="size-3.5 fill-[#f24a00] text-[#f24a00] dark:fill-[#daff02] dark:text-[#daff02]"
                    strokeWidth={0}
                  />
                ))}
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {item.content}
              </p>
            </div>

            <div className="flex shrink-0 gap-2 md:ml-auto">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled || isReorderPending}
                onClick={() => onEdit(item)}
              >
                <PencilIcon />
                Edytuj
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={disabled || isReorderPending}
                onClick={() => onDelete(item)}
              >
                <Trash2Icon />
                Usuń
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
