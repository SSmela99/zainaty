import {
  FOOTER_SOCIAL_KEYS,
  FOOTER_SOCIAL_LABELS,
  type FooterSocialKey,
} from "./social";
import type { FooterSettings } from "./types";

const SOCIAL_URL_FIELDS: Record<FooterSocialKey, keyof FooterSettings> = {
  facebook: "social_facebook",
  instagram: "social_instagram",
  linkedin: "social_linkedin",
  youtube: "social_youtube",
};

export function getFooterContactLines(settings: FooterSettings): string[] {
  return [
    settings.contact_line_1,
    settings.contact_line_2,
    settings.contact_line_3,
    settings.contact_line_4,
  ].filter((line) => line.trim().length > 0);
}

export function getFooterSocialUrl(
  settings: FooterSettings,
  key: FooterSocialKey,
): string {
  return settings[SOCIAL_URL_FIELDS[key]].trim();
}

export function getFooterSocialItems(settings: FooterSettings) {
  return FOOTER_SOCIAL_KEYS.map((key) => ({
    key,
    label: FOOTER_SOCIAL_LABELS[key],
    href: getFooterSocialUrl(settings, key),
  }));
}
