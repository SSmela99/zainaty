import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BlogImageChipProps = {
  children: ReactNode;
  className?: string;
};

export function BlogImageChip({ children, className }: BlogImageChipProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full bg-[#ff4b12] px-3 py-1 text-[11px] font-bold tracking-wide text-white uppercase dark:bg-[#d7ff00] dark:text-zinc-950",
        className,
      )}
    >
      {children}
    </span>
  );
}

type BlogImageChipsProps = {
  children: ReactNode;
  className?: string;
};

export function BlogImageChips({ children, className }: BlogImageChipsProps) {
  return (
    <div
      className={cn(
        "absolute top-4 left-4 z-10 flex max-w-[calc(100%-2rem)] flex-wrap gap-2",
        className,
      )}
    >
      {children}
    </div>
  );
}
