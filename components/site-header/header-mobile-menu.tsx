"use client";

import {
  BookOpenIcon,
  CalendarIcon,
  ChevronDownIcon,
  LayersIcon,
  MenuIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { UserAuthLink } from "@/components/auth/user-auth-link";
import { COURSE_NAV_CHILDREN, isCourseSectionPath, PATHS, type CourseNavChild } from "@/lib/paths";
import { cn } from "@/lib/utils";

import { courseNavIconByHref } from "./header-courses-menu.utils";
import { headerNavItems, isActiveNavItem } from "./site-header.utils";

const mobileCourseIcons = {
  book: BookOpenIcon,
  video: VideoIcon,
  layers: LayersIcon,
} as const;

function MobileCourseLink({
  child,
  pathname,
  onNavigate,
}: {
  child: CourseNavChild;
  pathname: string;
  onNavigate: () => void;
}) {
  const Icon = mobileCourseIcons[courseNavIconByHref[child.href]];
  const isActive = pathname === child.href;

  return (
    <Link
      href={child.href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors",
        isActive
          ? "text-[#f24a00] dark:text-[#daff02]"
          : "text-current hover:text-[#f24a00] dark:hover:text-[#daff02]",
      )}
    >
      <Icon strokeWidth={2.2} className="size-4 shrink-0" />
      {child.label}
    </Link>
  );
}

type HeaderMobileMenuProps = {
  onOpenChange?: (isOpen: boolean) => void;
};

export function HeaderMobileMenu({ onOpenChange }: HeaderMobileMenuProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCoursesOpen, setIsCoursesOpen] = useState(() =>
    isCourseSectionPath(pathname),
  );

  function setMenuOpen(open: boolean) {
    setIsOpen(open);
    onOpenChange?.(open);
  }

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
        aria-label={isOpen ? "Zamknij menu" : "Otworz menu"}
        onClick={() => setMenuOpen(!isOpen)}
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg text-current transition-colors hover:text-[#f24a00] dark:hover:text-[#daff02]"
      >
        {isOpen ? (
          <XIcon strokeWidth={2.2} className="size-5" />
        ) : (
          <MenuIcon strokeWidth={2.2} className="size-5" />
        )}
      </button>

      <button
        type="button"
        aria-label="Zamknij menu"
        onClick={closeMenu}
        className={`fixed inset-0 z-60 bg-zinc-950/40 transition-opacity duration-300 dark:bg-black/60 ${
          isOpen
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0"
        }`}
      />

      <nav
        id="mobile-nav"
        aria-label="Menu mobilne"
        className={`fixed top-0 right-0 z-70 flex h-full w-full max-w-sm flex-col border-l border-[#ddd8ce] bg-[#f1eee5] px-8 py-8 text-zinc-950 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-[#282828] dark:bg-[#1a1919] dark:text-white ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-black tracking-[-0.02em]">Menu</p>
          <div className="flex items-center gap-1">
            <UserAuthLink />
            <button
            type="button"
            aria-label="Zamknij menu"
            onClick={closeMenu}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg text-current transition-colors hover:text-[#f24a00] dark:hover:text-[#daff02]"
          >
            <XIcon strokeWidth={2.2} className="size-5" />
          </button>
          </div>
        </div>

        <ul className="mt-10 flex flex-col gap-1">
          {headerNavItems.map((item) => {
            const isActive = isActiveNavItem(item, pathname);

            if (item.children?.length) {
              return (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => setIsCoursesOpen((value) => !value)}
                    aria-expanded={isCoursesOpen}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-base font-black transition-colors",
                      isActive
                        ? "text-[#f24a00] dark:text-[#daff02]"
                        : "text-current hover:text-[#f24a00] dark:hover:text-[#daff02]",
                    )}
                  >
                    {item.label}
                    <ChevronDownIcon
                      strokeWidth={2.5}
                      className={cn(
                        "size-4 transition-transform duration-300",
                        isCoursesOpen ? "rotate-180" : "rotate-0",
                      )}
                    />
                  </button>
                  {isCoursesOpen ? (
                    <ul className="mt-1 flex flex-col gap-1 pl-2">
                      {COURSE_NAV_CHILDREN.map((child) => (
                        <li key={child.href}>
                          <MobileCourseLink
                            child={child}
                            pathname={pathname}
                            onNavigate={closeMenu}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isActive
                      ? "block rounded-lg px-3 py-3 text-base font-black text-[#f24a00] dark:text-[#daff02]"
                      : "block rounded-lg px-3 py-3 text-base font-black text-current transition-colors hover:text-[#f24a00] dark:hover:text-[#daff02]"
                  }
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto flex flex-col gap-3 pt-10">
          <Link
            href={PATHS.LOGIN}
            onClick={closeMenu}
            className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-[5px] border-2 border-[#ddd8ce] bg-transparent text-sm font-black text-current transition-transform hover:-translate-y-0.5 hover:scale-[1.02] dark:border-[#333333]"
          >
            Zaloguj się
          </Link>
          <Link
            href={PATHS.CONSULTATION}
            onClick={closeMenu}
            className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] border-2 border-[#f24a00] bg-transparent text-sm font-black text-[#f24a00] transition-transform hover:-translate-y-0.5 hover:scale-[1.02] dark:border-[#daff02] dark:text-[#daff02]"
          >
            <CalendarIcon strokeWidth={2.2} className="size-4" />
            Konsultacja
          </Link>
          <Link
            href={PATHS.COURSES_TRAININGS}
            onClick={closeMenu}
            className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-[5px] bg-[#f24a00] text-sm font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-[1.02] dark:bg-[#daff02] dark:text-zinc-950"
          >
            Zobacz kursy
          </Link>
        </div>
      </nav>
    </div>
  );
}
