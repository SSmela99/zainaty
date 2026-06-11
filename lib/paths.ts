export const PATHS = {
  HOME: "/",
  OFFER: "/oferta",
  EBOOKS: "/ebooki",
  BLOG: "/blog",
  ABOUT: "/o-nas",
  FAQ: "/faq",
} as const;

export type AppPath = (typeof PATHS)[keyof typeof PATHS];

export type NavLink = {
  label: string;
  href: AppPath;
};

export const PRIMARY_NAV: readonly NavLink[] = [
  { label: "Home", href: PATHS.HOME },
  { label: "Oferta", href: PATHS.OFFER },
  { label: "E-booki", href: PATHS.EBOOKS },
  { label: "Blog", href: PATHS.BLOG },
  { label: "O nas", href: PATHS.ABOUT },
  { label: "FAQ", href: PATHS.FAQ },
] as const;
