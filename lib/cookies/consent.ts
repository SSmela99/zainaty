export const COOKIE_CONSENT_STORAGE_KEY = "zainaty-cookie-consent";
export const COOKIE_CONSENT_VERSION = 1;

/** CustomEvent names (window). */
export const COOKIE_CONSENT_UPDATED_EVENT = "zainaty:cookie-consent-updated";
export const COOKIE_CONSENT_OPEN_SETTINGS_EVENT =
  "zainaty:open-cookie-settings";
export const COOKIE_CONSENT_DIALOG_OPEN_EVENT =
  "zainaty:cookie-consent-dialog-open";

export type CookieConsentCategories = {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
};

export type CookieConsentState = CookieConsentCategories & {
  version: number;
  updatedAt: string;
};

export const DEFAULT_DENIED_CONSENT: CookieConsentCategories = {
  necessary: true,
  preferences: false,
  analytics: false,
  marketing: false,
};

export const DEFAULT_ACCEPTED_CONSENT: CookieConsentCategories = {
  necessary: true,
  preferences: true,
  analytics: true,
  marketing: true,
};

export function isCookieConsentState(
  value: unknown,
): value is CookieConsentState {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    v.version === COOKIE_CONSENT_VERSION &&
    v.necessary === true &&
    typeof v.preferences === "boolean" &&
    typeof v.analytics === "boolean" &&
    typeof v.marketing === "boolean" &&
    typeof v.updatedAt === "string"
  );
}

export function readCookieConsent(): CookieConsentState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isCookieConsentState(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeCookieConsent(
  categories: CookieConsentCategories,
): CookieConsentState {
  const state: CookieConsentState = {
    ...categories,
    necessary: true,
    version: COOKIE_CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_UPDATED_EVENT, { detail: state }),
  );
  return state;
}

export function hasAnalyticsConsent(
  state: CookieConsentState | null = readCookieConsent(),
): boolean {
  return Boolean(state?.analytics);
}

export function hasMarketingConsent(
  state: CookieConsentState | null = readCookieConsent(),
): boolean {
  return Boolean(state?.marketing);
}

export function hasPreferencesConsent(
  state: CookieConsentState | null = readCookieConsent(),
): boolean {
  return Boolean(state?.preferences);
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(COOKIE_CONSENT_OPEN_SETTINGS_EVENT));
}
