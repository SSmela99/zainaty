import { PATHS, PRIMARY_NAV, type NavLink } from "@/lib/paths";

export const HEADER_SCROLL_THRESHOLD_PX = 24;

export type HeaderNavItem = NavLink;

export const headerNavItems: readonly HeaderNavItem[] = PRIMARY_NAV;

export function isActiveNavItem(item: HeaderNavItem, pathname: string) {
  if (item.href === PATHS.HOME) {
    return pathname === PATHS.HOME;
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
