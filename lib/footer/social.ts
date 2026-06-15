export const FOOTER_SOCIAL_KEYS = [
  "facebook",
  "instagram",
  "linkedin",
  "youtube",
] as const;

export type FooterSocialKey = (typeof FOOTER_SOCIAL_KEYS)[number];

export const FOOTER_SOCIAL_LABELS: Record<FooterSocialKey, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};
