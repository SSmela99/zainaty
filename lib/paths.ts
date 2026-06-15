export const PATHS = {
  HOME: "/",
  OFFER: "/oferta",
  COURSES: "/kursy",
  BLOG: "/blog",
  ABOUT: "/o-nas",
  FAQ: "/faq",
  PRIVACY: "/polityka-prywatnosci",
  TERMS: "/regulamin",
  ADMIN: "/admin",
} as const;

export type AppPath = (typeof PATHS)[keyof typeof PATHS];

export type NavLink = {
  label: string;
  href: AppPath;
};

export const PRIMARY_NAV: readonly NavLink[] = [
  { label: "Home", href: PATHS.HOME },
  { label: "Oferta", href: PATHS.OFFER },
  { label: "Kursy", href: PATHS.COURSES },
  { label: "Blog", href: PATHS.BLOG },
  { label: "O nas", href: PATHS.ABOUT },
  { label: "FAQ", href: PATHS.FAQ },
] as const;

export function isBlogArticlePath(pathname: string): boolean {
  return pathname.startsWith(`${PATHS.BLOG}/`) && pathname !== PATHS.BLOG;
}
