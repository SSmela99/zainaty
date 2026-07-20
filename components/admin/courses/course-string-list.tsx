"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CourseStringListProps = {
  label: string;
  description?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  error?: string;
};

export function CourseStringList({
  label,
  description,
  values,
  onChange,
  placeholder = "Wpisz punkt i kliknij Dodaj",
  error,
}: CourseStringListProps) {
  function updateItem(index: number, value: string) {
    const next = [...values];
    next[index] = value;
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(values.filter((_, itemIndex) => itemIndex !== index));
  }

  function addItem() {
    onChange([...values, ""]);
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold tracking-[-0.01em] text-zinc-800 dark:text-zinc-100">
          {label}
        </p>
        {description ? (
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={`${label}-${index}`} className="flex gap-2">
            <Input
              value={value}
              onChange={(event) => updateItem(index, event.target.value)}
              placeholder={placeholder}
              className={cn(
                "h-11 flex-1 rounded-xl border bg-white px-3.5 text-sm dark:bg-[#151414]",
                error
                  ? "border-red-500 dark:border-red-500"
                  : "border-zinc-200 dark:border-zinc-700",
              )}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeItem(index)}
              aria-label="Usuń punkt"
              className="size-11 shrink-0 rounded-xl"
            >
              <Trash2Icon className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addItem}
        className="h-10 rounded-xl"
      >
        <PlusIcon />
        Dodaj punkt
      </Button>

      {error ? (
        <p className="text-xs font-medium text-red-500 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
