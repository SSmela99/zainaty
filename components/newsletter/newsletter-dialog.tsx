"use client";

import { SendIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { NEWSLETTER_SOURCE } from "@/lib/newsletter/constants";

import {
  NEWSLETTER_DIALOG_DELAY_MS,
  NEWSLETTER_DIALOG_STORAGE_KEY,
  newsletterDialogContent,
} from "./newsletter-dialog.utils";
import { useNewsletterSubscribe } from "./use-newsletter-subscribe";

export function NewsletterDialog() {
  const [open, setOpen] = useState(false);
  const { subscribe, isSubmitting } = useNewsletterSubscribe(
    NEWSLETTER_SOURCE.DIALOG,
  );

  useEffect(() => {
    if (localStorage.getItem(NEWSLETTER_DIALOG_STORAGE_KEY)) {
      return;
    }

    const timer = window.setTimeout(() => {
      setOpen(true);
    }, NEWSLETTER_DIALOG_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      localStorage.setItem(NEWSLETTER_DIALOG_STORAGE_KEY, "1");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-3xl border-0 bg-[#fbf6ec] p-0 shadow-xl ring-0 sm:max-w-lg dark:bg-[#1c1c1c] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
      >
        <DialogClose className="absolute top-5 right-5 flex size-10 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-zinc-500 outline-none transition-colors hover:bg-black/5 hover:text-zinc-950 focus-visible:ring-0 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white">
          <XIcon className="size-5" strokeWidth={2.5} />
          <span className="sr-only">Zamknij</span>
        </DialogClose>

        <div
          aria-hidden="true"
          className="h-1.5 bg-[#ff4b12] dark:bg-[#d7ff00]"
        />

        <div className="px-8 pt-8 pb-8">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#ffe1cc] dark:bg-[#3a3d10]">
            <SendIcon
              strokeWidth={2.2}
              aria-hidden="true"
              className="size-5 text-[#ff4b12] dark:text-[#d7ff00]"
            />
          </div>

          <DialogTitle className="mt-6 text-left text-2xl leading-[1.15] font-black tracking-[-0.02em] text-zinc-950 dark:text-white">
            {newsletterDialogContent.heading}
          </DialogTitle>

          <DialogDescription className="mt-4 text-left text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Dołącz do ponad{" "}
            <strong className="font-bold text-zinc-950 dark:text-white">
              {newsletterDialogContent.descriptionHighlight}
            </strong>
            , które co tydzień otrzymują nowe artykuły o AI i technologii —
            napisane po ludzku, bez technobełkotu.
          </DialogDescription>

          <form
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
            onSubmit={async (event) => {
              event.preventDefault();

              const form = event.currentTarget;
              const formData = new FormData(form);
              const email = String(formData.get("email") ?? "");
              const success = await subscribe(email);

              if (success) {
                form.reset();
                handleOpenChange(false);
              }
            }}
          >
            <Input
              type="email"
              name="email"
              required
              disabled={isSubmitting}
              autoComplete="email"
              placeholder={newsletterDialogContent.placeholder}
              className="h-12 flex-1 rounded-xl border-[#ded9cf] bg-white px-4 text-base text-zinc-950 placeholder:text-zinc-400 focus-visible:border-[#ff4b12]/40 focus-visible:ring-[#ff4b12]/15 dark:border-zinc-700 dark:bg-[#111111] dark:text-white dark:placeholder:text-zinc-500 dark:focus-visible:border-[#d7ff00]/40 dark:focus-visible:ring-[#d7ff00]/15"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 shrink-0 cursor-pointer rounded-xl bg-[#ff4b12] px-7 text-sm font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 dark:bg-[#d7ff00] dark:text-zinc-950"
            >
              {isSubmitting
                ? "Zapisuję..."
                : newsletterDialogContent.submitLabel}
            </button>
          </form>

          <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
            {newsletterDialogContent.disclaimer}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
