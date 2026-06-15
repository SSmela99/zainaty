"use client";

import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

import type { FaqItem } from "@/lib/faq/types";
import { cn } from "@/lib/utils";

type FaqAccordionProps = {
  items: FaqItem[];
};

type FaqAccordionItemProps = {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
};

function FaqAccordionItem({ item, isOpen, onToggle }: FaqAccordionItemProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-white transition-[border-color,box-shadow] duration-300 ease-out dark:bg-[#1c1c1c]",
        isOpen
          ? "border-2 border-[#ff4b12] shadow-[0_8px_32px_rgba(255,75,18,0.12)] dark:border-[#d7ff00] dark:shadow-[0_8px_32px_rgba(215,255,0,0.08)]"
          : "border-2 border-transparent shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:border-[#ff4b12]/40 dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] dark:hover:border-[#d7ff00]/40",
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center gap-4 px-5 py-5 text-left md:px-6 md:py-6"
      >
        <span className="min-w-0 flex-1 text-base leading-snug font-black tracking-[-0.02em] text-zinc-950 md:text-lg dark:text-white">
          {item.question}
        </span>

        <span
          aria-hidden
          className={cn(
            "relative inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-[background-color,color,transform] duration-300 ease-out",
            isOpen
              ? "bg-[#ff4b12] text-white dark:bg-[#d7ff00] dark:text-zinc-950"
              : "bg-[#ffe1cc] text-[#ff4b12] dark:bg-[#3a3d10] dark:text-[#d7ff00]",
          )}
        >
          <PlusIcon
            strokeWidth={2.5}
            className={cn(
              "absolute size-4 transition-all duration-300 ease-out",
              isOpen ? "scale-75 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100",
            )}
          />
          <MinusIcon
            strokeWidth={2.5}
            className={cn(
              "absolute size-4 transition-all duration-300 ease-out",
              isOpen ? "scale-100 rotate-0 opacity-100" : "scale-75 -rotate-90 opacity-0",
            )}
          />
        </span>
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-zinc-100 px-5 pb-5 md:px-6 md:pb-6 dark:border-zinc-800">
            <p className="pt-4 text-sm leading-7 text-zinc-600 md:text-base dark:text-zinc-400">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Brak opublikowanych pytań. Wróć wkrótce!
      </p>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      {items.map((item) => (
        <FaqAccordionItem
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() =>
            setOpenId((current) => (current === item.id ? null : item.id))
          }
        />
      ))}
    </div>
  );
}
