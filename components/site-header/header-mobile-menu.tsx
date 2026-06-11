"use client";

import { CalendarIcon, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { handleConsultationRedirect } from "@/lib/consultation";
import { PATHS } from "@/lib/paths";

import { headerNavItems, isActiveNavItem } from "./site-header.utils";

type HeaderMobileMenuProps = {
  onOpenChange?: (isOpen: boolean) => void;
};

export function HeaderMobileMenu({ onOpenChange }: HeaderMobileMenuProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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

  function handleConsultationClick() {
    closeMenu();
    handleConsultationRedirect();
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
        aria-label={isOpen ? "Zamknij menu" : "Otworz menu"}
        onClick={() => setMenuOpen(!isOpen)}
        className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg text-current transition-colors hover:text-[#ff4b12] dark:hover:text-[#d7ff00]"
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
        className={`fixed top-0 right-0 z-70 flex h-full w-full max-w-sm flex-col border-l border-[#ded9cf] bg-[#f2efe6] px-8 py-8 text-zinc-950 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:border-[#282828] dark:bg-[#111111] dark:text-white ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-black tracking-[-0.02em]">Menu</p>
          <button
            type="button"
            aria-label="Zamknij menu"
            onClick={closeMenu}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg text-current transition-colors hover:text-[#ff4b12] dark:hover:text-[#d7ff00]"
          >
            <XIcon strokeWidth={2.2} className="size-5" />
          </button>
        </div>

        <ul className="mt-10 flex flex-col gap-1">
          {headerNavItems.map((item) => {
            const isActive = isActiveNavItem(item, pathname);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={isActive ? "page" : undefined}
                  className={
                    isActive
                      ? "block rounded-lg px-3 py-3 text-base font-black text-[#ff4b12] dark:text-[#d7ff00]"
                      : "block rounded-lg px-3 py-3 text-base font-black text-current transition-colors hover:text-[#ff4b12] dark:hover:text-[#d7ff00]"
                  }
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-auto flex flex-col gap-3 pt-10">
          <button
            type="button"
            onClick={handleConsultationClick}
            className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] border-2 border-[#ff4b12] bg-transparent text-sm font-black text-[#ff4b12] transition-transform hover:-translate-y-0.5 hover:scale-[1.02] dark:border-[#d7ff00] dark:text-[#d7ff00]"
          >
            <CalendarIcon strokeWidth={2.2} className="size-4" />
            Konsultacja
          </button>
          <Link
            href={PATHS.EBOOKS}
            onClick={closeMenu}
            className="inline-flex h-12 w-full cursor-pointer items-center justify-center rounded-[5px] bg-[#ff4b12] text-sm font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-[1.02] dark:bg-[#d7ff00] dark:text-zinc-950"
          >
            Zobacz e-booki
          </Link>
        </div>
      </nav>
    </div>
  );
}
