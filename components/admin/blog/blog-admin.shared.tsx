"use client";

import { cn } from "@/lib/utils";

type AdminMessageProps = {
  error?: string | null;
};

export function AdminMessage({ error }: AdminMessageProps) {
  if (!error) return null;

  return (
    <p
      className={cn(
        "rounded-xl px-4 py-3 text-sm font-medium",
        "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
      )}
      role="alert"
    >
      {error}
    </p>
  );
}

export function AdminPanelCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-[#ddd8ce] bg-white p-6 md:p-8 dark:border-[#282828] dark:bg-[#1c1c1c]",
        className,
      )}
    >
      {children}
    </div>
  );
}
