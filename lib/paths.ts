import type { CourseKind } from "@/lib/courses/kinds";

export const PATHS = {
  HOME: "/",
  OFFER: "/oferta",
  COURSES: "/szkolenia",
  COURSES_TRAININGS: "/szkolenia",
  COURSES_VIDEO: "/szkolenia-wideo",
  COURSES_PACKAGES: "/pakiety-szkolen",
  BLOG: "/blog",
  FREE_MATERIALS: "/darmowe-materialy",
  ABOUT: "/o-nas",
  FAQ: "/faq",
  CONSULTATION: "/konsultacja",
  PRIVACY: "/polityka-prywatnosci",
  TERMS: "/regulamin",
  LOGIN: "/logowanie",
  LOGIN_ALIAS: "/login",
  REGISTER: "/rejestracja",
  SET_PASSWORD: "/ustaw-haslo",
  FORGOT_PASSWORD: "/zapomniane-haslo",
  RESET_PASSWORD: "/nowe-haslo",
  ACCOUNT: "/konto",
  ADMIN: "/admin",
} as const;

export type AppPath = (typeof PATHS)[keyof typeof PATHS];

export function coursePath(slug: string) {
  return `${PATHS.COURSES}/${slug}`;
}

export function blogPath(slug: string) {
  return `${PATHS.BLOG}/${slug}`;
}

export function accountVideoCoursePath(slug: string) {
  return `${PATHS.ACCOUNT}/kurs/${slug}`;
}

export function checkoutPath(slug: string, code?: string) {
  const base = `${coursePath(slug)}/zakup`;

  if (!code?.trim()) {
    return base;
  }

  return `${base}?kod=${encodeURIComponent(code.trim().toUpperCase())}`;
}

export function courseListPathByKind(kind: CourseKind): AppPath {
  switch (kind) {
    case "video":
      return PATHS.COURSES_VIDEO;
    case "package":
      return PATHS.COURSES_PACKAGES;
    default:
      return PATHS.COURSES_TRAININGS;
  }
}

export type CourseNavChild = {
  label: string;
  href:
    | typeof PATHS.COURSES_TRAININGS
    | typeof PATHS.COURSES_VIDEO
    | typeof PATHS.COURSES_PACKAGES;
};

export const COURSE_NAV_CHILDREN: readonly CourseNavChild[] = [
  { label: "Szkolenia", href: PATHS.COURSES_TRAININGS },
  { label: "Szkolenia wideo", href: PATHS.COURSES_VIDEO },
  { label: "Pakiety szkoleń", href: PATHS.COURSES_PACKAGES },
] as const;

export type NavLink = {
  label: string;
  href: AppPath;
  children?: readonly CourseNavChild[];
};

export const PRIMARY_NAV: readonly NavLink[] = [
  { label: "Strona główna", href: PATHS.HOME },
  { label: "Oferta", href: PATHS.OFFER },
  { label: "Kursy", href: PATHS.COURSES, children: COURSE_NAV_CHILDREN },
  { label: "Blog", href: PATHS.BLOG },
  { label: "Darmowe materiały", href: PATHS.FREE_MATERIALS },
  { label: "O nas", href: PATHS.ABOUT },
  { label: "FAQ", href: PATHS.FAQ },
] as const;

export function isCourseSectionPath(pathname: string): boolean {
  if (
    pathname === PATHS.COURSES ||
    pathname.startsWith(`${PATHS.COURSES}/`)
  ) {
    return true;
  }

  return COURSE_NAV_CHILDREN.some(
    (child) =>
      pathname === child.href || pathname.startsWith(`${child.href}/`),
  );
}

export function isBlogArticlePath(pathname: string): boolean {
  return pathname.startsWith(`${PATHS.BLOG}/`) && pathname !== PATHS.BLOG;
}
