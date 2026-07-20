"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { BlogContent, type BlogContentVariant } from "@/components/blog";
import { cn } from "@/lib/utils";

import { BlogHtmlHelpDialog } from "./blog-html-help-dialog";

type BlogContentEditorProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  textareaClassName?: string;
};

type ContentTab = "edit" | "preview";

const contentTabs: { id: ContentTab; label: string }[] = [
  { id: "edit", label: "Edycja" },
  { id: "preview", label: "Podgląd" },
];

const previewThemes: { id: BlogContentVariant; label: string }[] = [
  { id: "light", label: "Jasny" },
  { id: "dark", label: "Ciemny" },
];

type SegmentedControlProps<T extends string> = {
  items: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
};

function SegmentedControl<T extends string>({
  items,
  value,
  onChange,
  size = "md",
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex w-fit shrink-0 rounded-lg border border-zinc-200 bg-zinc-100/80 p-0.5 dark:border-zinc-700 dark:bg-zinc-900/80",
        size === "sm" && "rounded-md",
      )}
    >
      {items.map((item) => {
        const isActive = value === item.id;

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={cn(
              "cursor-pointer rounded-md font-semibold transition-all",
              size === "md" ? "px-3.5 py-1.5 text-xs" : "px-2.5 py-1 text-[11px]",
              isActive
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-white"
                : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export function BlogContentEditor({
  value,
  onChange,
  error,
  textareaClassName,
}: BlogContentEditorProps) {
  const [tab, setTab] = useState<ContentTab>("edit");
  const [previewTheme, setPreviewTheme] = useState<BlogContentVariant>("light");
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme === "dark") {
      setPreviewTheme("dark");
    } else if (resolvedTheme === "light") {
      setPreviewTheme("light");
    }
  }, [resolvedTheme]);

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <SegmentedControl items={contentTabs} value={tab} onChange={setTab} />

          {tab === "preview" ? (
            <>
              <span
                aria-hidden
                className="hidden h-4 w-px shrink-0 bg-zinc-300 dark:bg-zinc-600 sm:block"
              />
              <SegmentedControl
                items={previewThemes}
                value={previewTheme}
                onChange={setPreviewTheme}
                size="sm"
              />
            </>
          ) : null}
        </div>

        <BlogHtmlHelpDialog />
      </div>

      {tab === "edit" ? (
        <textarea
          id="post-content"
          rows={14}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={Boolean(error)}
          className={cn("block w-full min-w-0", textareaClassName)}
          placeholder="<blockquote>Wstęp artykułu...</blockquote>"
        />
      ) : (
        <div
          className={cn(
            "min-h-90 w-full rounded-xl border p-5 md:p-6",
            previewTheme === "light"
              ? "border-[#ddd8ce] bg-[#f1eee5]"
              : "border-[#282828] bg-[#151414]",
          )}
        >
          {value.trim() ? (
            <BlogContent html={value} variant={previewTheme} />
          ) : (
            <p className="text-sm text-zinc-500">
              Brak treści do podglądu. Wpisz HTML w zakładce Edycja.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
