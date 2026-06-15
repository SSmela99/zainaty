"use client";

import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { adminSelectClassName } from "./admin-form-field";

type AdminSelectProps = React.ComponentProps<"select"> & {
  hasError?: boolean;
};

export function AdminSelect({
  hasError = false,
  className,
  children,
  ...props
}: AdminSelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          adminSelectClassName(hasError),
          "cursor-pointer appearance-none pr-12",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon
        strokeWidth={2.2}
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
        aria-hidden="true"
      />
    </div>
  );
}
