"use client";

import { TagIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { applyDiscountCode } from "@/app/actions/discount-codes";
import { formatCoursePriceCompact } from "@/lib/courses/format";
import type { AppliedDiscount } from "@/lib/discount-codes/types";
import { cn } from "@/lib/utils";

type CheckoutDiscountCodeProps = {
  courseSlug: string;
  initialCode?: string;
  applied: AppliedDiscount | null;
  onApplied: (applied: AppliedDiscount | null) => void;
};

export function CheckoutDiscountCode({
  courseSlug,
  initialCode,
  applied,
  onApplied,
}: CheckoutDiscountCodeProps) {
  const [code, setCode] = useState(initialCode ?? "");
  const [isPending, startTransition] = useTransition();
  const [autoApplied, setAutoApplied] = useState(false);
  const applyCodeRef = useRef<(rawCode: string) => void>(() => {});

  function applyCode(rawCode: string) {
    const trimmed = rawCode.trim();

    if (!trimmed) {
      toast.error("Podaj kod rabatowy.");
      return;
    }

    startTransition(async () => {
      const result = await applyDiscountCode(courseSlug, trimmed);

      if (!result.ok) {
        onApplied(null);
        toast.error(result.error);
        return;
      }

      onApplied(result.applied);
      setCode(result.applied.code);
      toast.success(`Kod ${result.applied.code} został zastosowany.`);
    });
  }

  applyCodeRef.current = applyCode;

  useEffect(() => {
    if (!initialCode || autoApplied || applied) {
      return;
    }

    setAutoApplied(true);
    applyCodeRef.current(initialCode);
  }, [initialCode, autoApplied, applied]);

  return (
    <div className="rounded-2xl border border-dashed border-[#ff4b12]/35 bg-[#fff7f2] p-5 dark:border-[#d7ff00]/25 dark:bg-[#242418]">
      <div className="flex items-center gap-2.5">
        <TagIcon
          className="size-5 text-[#ff4b12] dark:text-[#d7ff00]"
          strokeWidth={2.2}
        />
        <h3 className="text-base font-black text-zinc-950 dark:text-white">
          Masz kod rabatowy?
        </h3>
      </div>

      {applied ? (
        <div className="mt-4 flex items-start justify-between gap-3 rounded-xl border border-[#ff4b12]/20 bg-white p-4 dark:border-[#d7ff00]/20 dark:bg-[#1c1c1c]">
          <div>
            <p className="font-mono text-sm font-black tracking-[0.12em] text-[#ff4b12] dark:text-[#d7ff00]">
              {applied.code}
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Oszczędzasz{" "}
              <span className="font-bold text-zinc-950 dark:text-white">
                {formatCoursePriceCompact(applied.savingsPln)}
              </span>{" "}
              ({applied.label})
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onApplied(null);
              setCode("");
            }}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-[#282828] dark:hover:text-white"
            aria-label="Usuń kod rabatowy"
          >
            <XIcon className="size-4" />
          </button>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="np. WIOSNA20"
            disabled={isPending}
            className={cn(
              "h-12 flex-1 rounded-xl border border-[#ded9cf] bg-white px-4 font-mono text-sm tracking-[0.08em] text-zinc-950 uppercase outline-none transition-shadow focus:ring-2 focus:ring-[#ff4b12]/30 dark:border-[#282828] dark:bg-[#141414] dark:text-white dark:focus:ring-[#d7ff00]/30",
            )}
          />
          <button
            type="button"
            onClick={() => applyCode(code)}
            disabled={isPending}
            className="h-12 shrink-0 rounded-xl bg-zinc-950 px-5 text-sm font-black text-white transition-transform hover:-translate-y-0.5 disabled:opacity-60 dark:bg-[#d7ff00] dark:text-zinc-950"
          >
            {isPending ? "Sprawdzam..." : "Zastosuj"}
          </button>
        </div>
      )}
    </div>
  );
}
