import { cn } from "@/lib/utils";

type AdminLoadingProps = {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const spinnerSize = {
  sm: "size-5 border-2",
  md: "size-8 border-[3px]",
  lg: "size-10 border-[3px]",
} as const;

export function AdminLoading({
  label = "Ładowanie...",
  className,
  size = "md",
}: AdminLoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-10",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className={cn(
          spinnerSize[size],
          "animate-spin rounded-full border-zinc-200 border-t-[#f24a00] dark:border-zinc-700 dark:border-t-[#daff02]",
        )}
      />
      {label ? (
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
      ) : null}
    </div>
  );
}
