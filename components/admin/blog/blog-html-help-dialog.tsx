"use client";

import { CircleHelpIcon } from "lucide-react";
import { useState } from "react";

import { BlogContent } from "@/components/blog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  blogHtmlGuideEntries,
  blogHtmlGuideFullExample,
  blogHtmlGuideIntro,
} from "@/lib/blog/html-guide";

function HtmlCodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-2 overflow-x-auto rounded-xl bg-zinc-950 p-3 text-[12px] leading-6 text-zinc-300">
      <code>{code}</code>
    </pre>
  );
}

export function BlogHtmlHelpDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 text-xs font-bold"
        onClick={() => setOpen(true)}
      >
        <CircleHelpIcon className="size-3.5" />
        Pomoc HTML
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          className="flex max-h-[min(90vh,820px)] flex-col gap-0 overflow-hidden rounded-2xl border border-zinc-200 p-0 sm:max-w-3xl dark:border-zinc-800"
        >
          <DialogHeader className="shrink-0 border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
            <DialogTitle className="text-lg font-black tracking-[-0.02em]">
              Tagi HTML w artykule
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              {blogHtmlGuideIntro}
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 pt-5 pb-10">
            <div className="space-y-5">
              {blogHtmlGuideEntries.map((entry) => (
                <section
                  key={entry.tag}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800"
                >
                  <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
                    <p className="font-mono text-sm font-bold text-[#f24a00] dark:text-[#daff02]">
                      {entry.tag}
                    </p>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {entry.description}
                    </p>
                  </div>

                  <div className="grid gap-0 lg:grid-cols-2">
                    <div className="border-b border-zinc-100 px-4 py-3 lg:border-r lg:border-b-0 dark:border-zinc-800">
                      <p className="text-[11px] font-bold tracking-[0.16em] text-zinc-500 uppercase">
                        Kod
                      </p>
                      <HtmlCodeBlock code={entry.example} />
                    </div>

                    <div className="px-4 py-3">
                      <p className="text-[11px] font-bold tracking-[0.16em] text-zinc-500 uppercase">
                        Podgląd (ciemny)
                      </p>
                      <div className="mt-2 rounded-xl border border-[#282828] bg-[#151414] p-4">
                        <BlogContent html={entry.example} variant="dark" />
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <section className="mt-8 space-y-4">
              <div>
                <p className="text-sm font-black tracking-[-0.01em]">
                  Przykład pełnego artykułu
                </p>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Tak może wyglądać gotowa treść po złożeniu kilku tagów razem.
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold tracking-[0.16em] text-zinc-500 uppercase">
                  Podgląd (jasny motyw)
                </p>
                <div className="mt-2 rounded-2xl border border-[#ddd8ce] bg-[#f1eee5] p-5 md:p-6">
                  <BlogContent html={blogHtmlGuideFullExample} variant="light" />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold tracking-[0.16em] text-zinc-500 uppercase">
                  Podgląd (ciemny motyw)
                </p>
                <div className="mt-2 rounded-2xl border border-[#282828] bg-[#151414] p-5 md:p-6">
                  <BlogContent html={blogHtmlGuideFullExample} variant="dark" />
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold tracking-[0.16em] text-zinc-500 uppercase">
                  HTML
                </p>
                <HtmlCodeBlock code={blogHtmlGuideFullExample} />
              </div>
            </section>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
