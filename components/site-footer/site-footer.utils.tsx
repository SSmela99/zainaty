import { PRIMARY_NAV, type NavLink } from "@/lib/paths";

const SOCIAL = {
  FACEBOOK: "facebook",
  INSTAGRAM: "instagram",
  LINKEDIN: "linkedin",
  YOUTUBE: "youtube",
} as const;

const LEGAL_LINK = {
  PRIVACY: "Polityka prywatności",
  TERMS: "Regulamin",
  WEBSITE_BUILDER: "Website Builder",
} as const;

const SOCIAL_LABEL: Record<SocialKey, string> = {
  [SOCIAL.FACEBOOK]: "Facebook",
  [SOCIAL.INSTAGRAM]: "Instagram",
  [SOCIAL.LINKEDIN]: "LinkedIn",
  [SOCIAL.YOUTUBE]: "YouTube",
};

const SOCIAL_GLYPH_CLASS = "size-3.5";

export type SocialKey = (typeof SOCIAL)[keyof typeof SOCIAL];
export type FooterNavItem = NavLink;
export type FooterLegalLink = (typeof LEGAL_LINK)[keyof typeof LEGAL_LINK];

export const footerNavItems: readonly FooterNavItem[] = PRIMARY_NAV;
export const footerLegalLinks = Object.values(LEGAL_LINK) as FooterLegalLink[];

export const footerSocials: { key: SocialKey; label: string }[] = (
  Object.values(SOCIAL) as SocialKey[]
).map((key) => ({ key, label: SOCIAL_LABEL[key] }));

export function SocialGlyph({ name }: { name: SocialKey }) {
  switch (name) {
    case SOCIAL.FACEBOOK:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
          className={SOCIAL_GLYPH_CLASS}
        >
          <path d="M13.5 9h2.2l-.4 3H13.5v8h-3v-8H8.5V9h2V7.3C10.5 5.4 11.6 4 13.8 4H16v3h-1.6c-.6 0-.9.3-.9 1V9z" />
        </svg>
      );
    case SOCIAL.INSTAGRAM:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden
          className={SOCIAL_GLYPH_CLASS}
        >
          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
          <circle cx="12" cy="12" r="3.6" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      );
    case SOCIAL.LINKEDIN:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
          className={SOCIAL_GLYPH_CLASS}
        >
          <path d="M5.5 3.5a2 2 0 110 4 2 2 0 010-4zM3.5 9h4v11h-4V9zm6 0h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.8 2.4 4.8 5.6V20h-4v-4.9c0-1.2 0-2.7-1.7-2.7s-2 1.3-2 2.6V20h-4V9z" />
        </svg>
      );
    case SOCIAL.YOUTUBE:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
          className={SOCIAL_GLYPH_CLASS}
        >
          <path d="M22 8.5c-.2-1.5-1-2.5-2.5-2.7C17.5 5.5 12 5.5 12 5.5s-5.5 0-7.5.3C3 6 2.2 7 2 8.5 1.7 10 1.7 12 1.7 12s0 2 .3 3.5c.2 1.5 1 2.5 2.5 2.7 2 .3 7.5.3 7.5.3s5.5 0 7.5-.3c1.5-.2 2.3-1.2 2.5-2.7.3-1.5.3-3.5.3-3.5s0-2-.3-3.5zM10 15V9l5 3-5 3z" />
        </svg>
      );
  }
}
