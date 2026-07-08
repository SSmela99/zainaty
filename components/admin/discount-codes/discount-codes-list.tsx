"use client";

import { PencilIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDiscountLabel } from "@/lib/discount-codes/apply";
import type { DiscountCode } from "@/lib/discount-codes/types";
import { cn } from "@/lib/utils";

type DiscountCodesListProps = {
  items: DiscountCode[];
  disabled?: boolean;
  onEdit: (item: DiscountCode) => void;
  onDelete: (item: DiscountCode) => void;
};

function formatExpiresAt(value: string | null): string {
  if (!value) return "Bez terminu";

  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatUses(item: DiscountCode): string {
  if (item.max_uses == null) {
    return `${item.used_count} / ∞`;
  }

  return `${item.used_count} / ${item.max_uses}`;
}

export function DiscountCodesList({
  items,
  disabled = false,
  onEdit,
  onDelete,
}: DiscountCodesListProps) {
  return (
    <div className="mt-4 space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800 md:flex-row md:items-center md:justify-between"
        >
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base font-black tracking-[0.08em]">
                {item.code}
              </span>
              <span className="rounded-full bg-[#ff4b12]/10 px-2.5 py-1 text-xs font-bold text-[#ff4b12] dark:bg-[#ff6b4a]/10 dark:text-[#ff6b4a]">
                {formatDiscountLabel(item.discount_type, item.discount_value)}
              </span>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-bold",
                  item.active
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
                )}
              >
                {item.active ? "Aktywny" : "Wyłączony"}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
              <span>Wygasa: {formatExpiresAt(item.expires_at)}</span>
              <span>Użycia: {formatUses(item)}</span>
              <span>
                Kurs: {item.course_title ?? "Wszystkie"}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => onEdit(item)}
            >
              <PencilIcon className="size-4" />
              Edytuj
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => onDelete(item)}
            >
              <Trash2Icon className="size-4" />
              Usuń
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
