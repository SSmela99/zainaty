"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CookieIcon, XIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { PATHS } from "@/lib/paths";
import {
  COOKIE_CONSENT_DIALOG_OPEN_EVENT,
  COOKIE_CONSENT_OPEN_SETTINGS_EVENT,
  DEFAULT_ACCEPTED_CONSENT,
  DEFAULT_DENIED_CONSENT,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentCategories,
} from "@/lib/cookies/consent";

import { cookieConsentContent } from "./cookie-consent.utils";

type View = "banner" | "settings";

const SHOW_DELAY_MS = 400;

function notifyCookieDialogOpen() {
  window.dispatchEvent(new Event(COOKIE_CONSENT_DIALOG_OPEN_EVENT));
}

export function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<View>("banner");
  const [hasStoredConsent, setHasStoredConsent] = useState(false);
  const [draft, setDraft] = useState<CookieConsentCategories>(
    DEFAULT_DENIED_CONSENT,
  );

  useEffect(() => {
    setMounted(true);

    const existing = readCookieConsent();
    if (!existing) {
      const timer = window.setTimeout(() => {
        setDraft(DEFAULT_DENIED_CONSENT);
        setHasStoredConsent(false);
        setView("banner");
        setVisible(true);
        notifyCookieDialogOpen();
      }, SHOW_DELAY_MS);
      return () => window.clearTimeout(timer);
    }

    setHasStoredConsent(true);
    setDraft({
      necessary: true,
      preferences: existing.preferences,
      analytics: existing.analytics,
      marketing: existing.marketing,
    });
  }, []);

  useEffect(() => {
    function handleOpenSettings() {
      const existing = readCookieConsent();
      setDraft(
        existing
          ? {
              necessary: true,
              preferences: existing.preferences,
              analytics: existing.analytics,
              marketing: existing.marketing,
            }
          : DEFAULT_DENIED_CONSENT,
      );
      setHasStoredConsent(Boolean(existing));
      setView("settings");
      setVisible(true);
      notifyCookieDialogOpen();
    }

    window.addEventListener(
      COOKIE_CONSENT_OPEN_SETTINGS_EVENT,
      handleOpenSettings,
    );
    return () => {
      window.removeEventListener(
        COOKIE_CONSENT_OPEN_SETTINGS_EVENT,
        handleOpenSettings,
      );
    };
  }, []);

  function persist(categories: CookieConsentCategories) {
    writeCookieConsent(categories);
    setHasStoredConsent(true);
    setVisible(false);
    setView("banner");
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setVisible(true);
      return;
    }

    // Pierwsza wizyta: trzeba wybrać opcję - overlay nie zamyka.
    if (!hasStoredConsent) return;
    setVisible(false);
    setView("banner");
  }

  if (!mounted) {
    return null;
  }

  return (
    <Dialog
      open={visible}
      onOpenChange={handleOpenChange}
      disablePointerDismissal={!hasStoredConsent}
    >
      <DialogContent
        showCloseButton={false}
        overlayClassName="z-[80] bg-black/50 backdrop-blur-md supports-backdrop-filter:backdrop-blur-md"
        className="z-[81] max-h-[min(90vh,720px)] w-full max-w-[calc(100%-1.5rem)] gap-0 overflow-y-auto rounded-2xl border-0 bg-[#f1eee5] p-0 shadow-[0_20px_60px_rgba(0,0,0,0.35)] ring-0 sm:max-w-xl dark:bg-[#1c1c1c] dark:shadow-[0_20px_60px_rgba(0,0,0,0.65)]"
      >
        <div aria-hidden className="h-1.5 bg-[#f24a00] dark:bg-[#daff02]" />

        <div className="relative px-5 pt-5 pb-5 sm:px-7 sm:pt-6 sm:pb-6">
          {hasStoredConsent ? (
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="absolute top-3.5 right-3.5 flex size-9 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-black/5 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Zamknij"
            >
              <XIcon className="size-4.5" strokeWidth={2.5} />
            </button>
          ) : null}

          <div className="flex items-start gap-3 pr-8">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#ffd0bc] dark:bg-[#3a4500]">
              <CookieIcon
                className="size-5 text-[#f24a00] dark:text-[#daff02]"
                strokeWidth={2.2}
              />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg font-black tracking-[0.01em] text-zinc-950 sm:text-xl dark:text-white">
                {cookieConsentContent.title}
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {cookieConsentContent.description}{" "}
                <Link
                  href={`${PATHS.PRIVACY}#cookies`}
                  className="font-semibold text-[#f24a00] underline-offset-2 hover:underline dark:text-[#daff02]"
                >
                  {cookieConsentContent.privacyLinkLabel}
                </Link>
                .
              </DialogDescription>
            </div>
          </div>

          {view === "settings" ? (
            <div className="mt-5 space-y-3">
              <CategoryRow
                label={cookieConsentContent.categories.necessary.label}
                description={
                  cookieConsentContent.categories.necessary.description
                }
                checked
                disabled
              />
              <CategoryRow
                label={cookieConsentContent.categories.preferences.label}
                description={
                  cookieConsentContent.categories.preferences.description
                }
                checked={draft.preferences}
                onChange={(checked) =>
                  setDraft((prev) => ({ ...prev, preferences: checked }))
                }
              />
              <CategoryRow
                label={cookieConsentContent.categories.analytics.label}
                description={
                  cookieConsentContent.categories.analytics.description
                }
                checked={draft.analytics}
                onChange={(checked) =>
                  setDraft((prev) => ({ ...prev, analytics: checked }))
                }
              />
              <CategoryRow
                label={cookieConsentContent.categories.marketing.label}
                description={
                  cookieConsentContent.categories.marketing.description
                }
                checked={draft.marketing}
                onChange={(checked) =>
                  setDraft((prev) => ({ ...prev, marketing: checked }))
                }
              />
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
            {view === "banner" ? (
              <>
                <button
                  type="button"
                  onClick={() => persist(DEFAULT_ACCEPTED_CONSENT)}
                  className="h-11 cursor-pointer rounded-xl bg-[#f24a00] px-5 text-sm font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-[1.02] dark:bg-[#daff02] dark:text-zinc-950"
                >
                  {cookieConsentContent.acceptAll}
                </button>
                <button
                  type="button"
                  onClick={() => persist(DEFAULT_DENIED_CONSENT)}
                  className="h-11 cursor-pointer rounded-xl border border-zinc-300 bg-white px-5 text-sm font-black text-zinc-950 transition-transform hover:-translate-y-0.5 dark:border-zinc-600 dark:bg-[#151414] dark:text-white"
                >
                  {cookieConsentContent.necessaryOnly}
                </button>
                <button
                  type="button"
                  onClick={() => setView("settings")}
                  className="h-11 cursor-pointer rounded-xl px-4 text-sm font-bold text-zinc-700 underline-offset-2 hover:underline dark:text-zinc-300"
                >
                  {cookieConsentContent.settings}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => persist(draft)}
                  className="h-11 cursor-pointer rounded-xl bg-[#f24a00] px-5 text-sm font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-[1.02] dark:bg-[#daff02] dark:text-zinc-950"
                >
                  {cookieConsentContent.save}
                </button>
                <button
                  type="button"
                  onClick={() => persist(DEFAULT_ACCEPTED_CONSENT)}
                  className="h-11 cursor-pointer rounded-xl border border-zinc-300 bg-white px-5 text-sm font-black text-zinc-950 transition-transform hover:-translate-y-0.5 dark:border-zinc-600 dark:bg-[#151414] dark:text-white"
                >
                  {cookieConsentContent.acceptAll}
                </button>
                <button
                  type="button"
                  onClick={() => setView("banner")}
                  className="h-11 cursor-pointer rounded-xl px-4 text-sm font-bold text-zinc-700 underline-offset-2 hover:underline dark:text-zinc-300"
                >
                  {cookieConsentContent.back}
                </button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CategoryRow({
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-200/90 bg-white/70 p-3.5 dark:border-zinc-700 dark:bg-[#151414]">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-[#f24a00] disabled:cursor-not-allowed dark:accent-[#daff02]"
      />
      <span className="min-w-0">
        <span className="block text-sm font-black text-zinc-950 dark:text-white">
          {label}
          {disabled ? (
            <span className="ml-2 text-[11px] font-bold tracking-wide text-zinc-500 uppercase">
              zawsze włączone
            </span>
          ) : null}
        </span>
        <span className="mt-1 block text-xs leading-5 text-zinc-600 dark:text-zinc-400">
          {description}
        </span>
      </span>
    </label>
  );
}
