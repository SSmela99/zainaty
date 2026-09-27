/** Publiczne assety maili (bucket `assets` w Supabase). */
const ASSETS_BASE =
  "https://kalwgkqvqomezmtyaiwe.supabase.co/storage/v1/object/public/assets";

export const EMAIL_LOGO_URL = `${ASSETS_BASE}/zainaty-logo-big.svg`;

export const EMAIL_BG = {
  blue: `${ASSETS_BASE}/email-bg-blue.png`,
  orange: `${ASSETS_BASE}/email-bg-orange.png`,
  purple: `${ASSETS_BASE}/email-bg-purple.png`,
  yellow: `${ASSETS_BASE}/email-bg-yellow.png`,
} as const;

export const EMAIL_BG_FALLBACK = {
  blue: "#0a1628",
  orange: "#2a1408",
  purple: "#1a0a2e",
  yellow: "#142008",
} as const;

export type EmailBgTheme = keyof typeof EMAIL_BG;

export function emailLogoImgHtml(): string {
  return `<img src="${EMAIL_LOGO_URL}" width="160" height="73" alt="Z AI na Ty" style="display:block;margin:0 auto;width:160px;height:auto;border:0;outline:none;text-decoration:none;" />`;
}

/** Style tła zewnętrznego (pattern PNG + kolor fallback). */
export function emailOuterBackgroundStyle(theme: EmailBgTheme): string {
  const image = EMAIL_BG[theme];
  const color = EMAIL_BG_FALLBACK[theme];
  return `background-color:${color};background-image:url('${image}');background-repeat:repeat;background-position:top left;`;
}
