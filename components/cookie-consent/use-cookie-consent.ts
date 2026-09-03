"use client";

/**
 * Helper do ładowania skryptów analityki / marketingu dopiero po zgodzie.
 * Użyj w przyszłości np. przy GA / Meta Pixel.
 */

import { useEffect, useState } from "react";

import {
  COOKIE_CONSENT_UPDATED_EVENT,
  hasAnalyticsConsent,
  hasMarketingConsent,
  hasPreferencesConsent,
  readCookieConsent,
  type CookieConsentState,
} from "@/lib/cookies/consent";

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsentState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConsent(readCookieConsent());
    setReady(true);

    function onUpdate(event: Event) {
      const detail = (event as CustomEvent<CookieConsentState>).detail;
      setConsent(detail ?? readCookieConsent());
    }

    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, onUpdate);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, onUpdate);
    };
  }, []);

  return {
    ready,
    consent,
    analytics: hasAnalyticsConsent(consent),
    marketing: hasMarketingConsent(consent),
    preferences: hasPreferencesConsent(consent),
  };
}
