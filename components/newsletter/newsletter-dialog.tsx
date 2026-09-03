"use client";

import { MailIcon, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  COOKIE_CONSENT_DIALOG_OPEN_EVENT,
  COOKIE_CONSENT_UPDATED_EVENT,
  readCookieConsent,
} from "@/lib/cookies/consent";
import { NEWSLETTER_SOURCE } from "@/lib/newsletter/constants";
import { PATHS } from "@/lib/paths";

import {
  NEWSLETTER_DIALOG_DELAY_MS,
  NEWSLETTER_DIALOG_FREE_MATERIALS_DELAY_MS,
  NEWSLETTER_DIALOG_STORAGE_KEY,
  newsletterDialogContent,
  newsletterDialogFreeMaterialsContent,
} from "./newsletter-dialog.utils";
import { useNewsletterSubscribe } from "./use-newsletter-subscribe";

function waitForCookieConsentDecision(): Promise<void> {
  if (readCookieConsent()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    function onUpdate() {
      if (!readCookieConsent()) return;
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, onUpdate);
      resolve();
    }

    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, onUpdate);
  });
}

export function NewsletterDialog() {
  const pathname = usePathname();
  const isFreeMaterials = pathname === PATHS.FREE_MATERIALS;
  const content = isFreeMaterials
    ? newsletterDialogFreeMaterialsContent
    : newsletterDialogContent;
  const source = isFreeMaterials
    ? NEWSLETTER_SOURCE.FREE_MATERIALS
    : NEWSLETTER_SOURCE.DIALOG;

  const [open, setOpen] = useState(false);
  const { subscribe, isSubmitting } = useNewsletterSubscribe(source);

  useEffect(() => {
    if (localStorage.getItem(NEWSLETTER_DIALOG_STORAGE_KEY)) {
      return;
    }

    let cancelled = false;
    let timer: number | undefined;

    void (async () => {
      await waitForCookieConsentDecision();
      if (cancelled) return;

      const delay = isFreeMaterials
        ? NEWSLETTER_DIALOG_FREE_MATERIALS_DELAY_MS
        : NEWSLETTER_DIALOG_DELAY_MS;

      timer = window.setTimeout(() => {
        if (!cancelled) setOpen(true);
      }, delay);
    })();

    return () => {
      cancelled = true;
      if (timer != null) window.clearTimeout(timer);
    };
  }, [isFreeMaterials]);

  useEffect(() => {
    function hideForCookies() {
      setOpen(false);
    }

    window.addEventListener(COOKIE_CONSENT_DIALOG_OPEN_EVENT, hideForCookies);
    return () => {
      window.removeEventListener(
        COOKIE_CONSENT_DIALOG_OPEN_EVENT,
        hideForCookies,
      );
    };
  }, []);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
  }

  function markNewsletterDialogSubscribed() {
    localStorage.setItem(NEWSLETTER_DIALOG_STORAGE_KEY, "1");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-auto right-0 bottom-0 left-0 max-w-none translate-x-0 translate-y-0 gap-0 overflow-hidden rounded-t-2xl rounded-b-none border-0 bg-[#f1eee5] p-0 shadow-xl ring-0 sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2 sm:max-w-xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl dark:bg-[#1c1c1c] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
      >
        <DialogClose className="absolute top-3.5 right-3.5 z-10 flex size-9 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-zinc-500 outline-none transition-colors hover:bg-black/5 hover:text-zinc-950 focus-visible:ring-0 sm:top-4 sm:right-4 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white">
          <XIcon className="size-4.5" strokeWidth={2.5} />
          <span className="sr-only">Zamknij</span>
        </DialogClose>

        <div
          aria-hidden="true"
          className="h-2 bg-[#f24a00] sm:h-2.5 dark:bg-[#daff02]"
        />

        <div className="px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8 sm:pt-7 sm:pb-8">
          <div className="flex size-10 items-center justify-center rounded-xl bg-[#ffd0bc] sm:size-11 dark:bg-[#3a4500]">
            <MailIcon
              strokeWidth={2.2}
              aria-hidden="true"
              className="size-4.5 text-[#f24a00] sm:size-5 dark:text-[#daff02]"
            />
          </div>

          <DialogTitle className="mt-4 pr-8 text-left text-xl leading-[1.2] font-black tracking-[0.01em] text-zinc-950 sm:mt-5 sm:pr-0 sm:text-[1.625rem] dark:text-white">
            {content.heading}
          </DialogTitle>

          <DialogDescription className="mt-2.5 text-left text-sm leading-6 text-zinc-950 sm:mt-3 sm:text-[15px] dark:text-zinc-300">
            {content.description}
          </DialogDescription>

          <form
            className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-stretch"
            onSubmit={async (event) => {
              event.preventDefault();

              const form = event.currentTarget;
              const formData = new FormData(form);
              const email = String(formData.get("email") ?? "");
              const success = await subscribe(email);

              if (success) {
                form.reset();
                markNewsletterDialogSubscribed();
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
              placeholder={content.placeholder}
              className="h-11 flex-1 rounded-xl border-[#ddd8ce] bg-white px-4 text-base text-zinc-950 placeholder:text-zinc-400 focus-visible:border-[#f24a00]/40 focus-visible:ring-[#f24a00]/15 sm:h-12 sm:text-[15px] dark:border-zinc-700 dark:bg-[#151414] dark:text-white dark:placeholder:text-zinc-500 dark:focus-visible:border-[#daff02]/40 dark:focus-visible:ring-[#daff02]/15"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full shrink-0 cursor-pointer rounded-xl bg-[#f24a00] px-6 text-[15px] font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:scale-100 sm:h-12 sm:w-auto sm:px-8 dark:bg-[#daff02] dark:text-zinc-950"
            >
              {isSubmitting ? "Zapisuję..." : content.submitLabel}
            </button>
          </form>

          <p className="mt-3 text-xs leading-5 text-zinc-500 sm:mt-4 dark:text-zinc-500">
            {content.disclaimer}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
