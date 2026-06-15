import { cn } from "@/lib/utils";

type AdminFormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
};

export function AdminFormField({
  label,
  htmlFor,
  error,
  required = false,
  hint,
  children,
  className,
}: AdminFormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-start justify-between gap-3">
        <label
          htmlFor={htmlFor}
          className="flex items-center gap-1.5 text-sm font-semibold tracking-[-0.01em] text-zinc-800 dark:text-zinc-100"
        >
          <span>{label}</span>
          {required ? (
            <span
              className="text-[#ff4b12] dark:text-[#d7ff00]"
              aria-hidden="true"
            >
              *
            </span>
          ) : null}
        </label>
        {hint ? (
          <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
            {hint}
          </span>
        ) : null}
      </div>

      {children}

      {error ? (
        <p className="text-xs font-medium text-red-500 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function adminInputClassName(hasError: boolean, className?: string) {
  return cn(
    "h-11 rounded-xl border bg-white px-3.5 text-sm transition-colors dark:bg-[#141414]",
    hasError
      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/25 dark:border-red-500"
      : "border-zinc-200 focus-visible:border-[#1a4dff] focus-visible:ring-[#1a4dff]/15 dark:border-zinc-700",
    className,
  );
}

export function adminTextareaClassName(hasError: boolean, className?: string) {
  return cn(
    "w-full min-w-0 rounded-xl border bg-white px-3.5 py-3 text-sm transition-colors dark:bg-[#141414]",
    hasError
      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/25 dark:border-red-500"
      : "border-zinc-200 focus-visible:border-[#1a4dff] focus-visible:ring-[#1a4dff]/15 dark:border-zinc-700",
    className,
  );
}

export function adminSelectClassName(hasError: boolean, className?: string) {
  return cn(
    "h-11 w-full rounded-xl border bg-white pl-3.5 text-sm text-zinc-900 outline-none transition-colors dark:bg-[#141414] dark:text-zinc-100",
    hasError
      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-3 focus-visible:ring-red-500/25 dark:border-red-500"
      : "border-zinc-200 focus-visible:border-[#1a4dff] focus-visible:ring-3 focus-visible:ring-[#1a4dff]/15 dark:border-zinc-700",
    className,
  );
}

export function adminFileClassName(hasError: boolean, className?: string) {
  return cn(
    "h-11 w-full rounded-xl border bg-white px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#ffe1cc] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[#ff4b12] dark:bg-[#141414] dark:file:bg-[#3a3d10] dark:file:text-[#d7ff00]",
    hasError
      ? "border-red-500 dark:border-red-500"
      : "border-zinc-200 dark:border-zinc-700",
    className,
  );
}
