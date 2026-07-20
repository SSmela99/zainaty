"use client";

import { GripVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { reorderFaqItems } from "@/app/admin/actions/faq";
import { Button } from "@/components/ui/button";
import { reorderFaqItemList } from "@/lib/faq/reorder";
import type { FaqItem } from "@/lib/faq/types";
import { cn } from "@/lib/utils";

type FaqSortableListProps = {
  items: FaqItem[];
  disabled?: boolean;
  onEdit: (item: FaqItem) => void;
  onDelete: (item: FaqItem) => void;
  onReorderFailed: () => void;
};

export function FaqSortableList({
  items,
  disabled = false,
  onEdit,
  onDelete,
  onReorderFailed,
}: FaqSortableListProps) {
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

    const nextItems = reorderFaqItemList(orderedItems, draggedId, targetId);
    setOrderedItems(nextItems);
    setDraggedId(null);
    setDragOverId(null);

    startReorderTransition(async () => {
      const result = await reorderFaqItems(nextItems.map((item) => item.id));
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

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-zinc-950 dark:text-white">
                  {item.question}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase ${
                    item.published
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {item.published ? "Opublikowane" : "Ukryte"}
                </span>
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {item.answer}
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
