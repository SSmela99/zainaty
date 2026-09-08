"use client";

import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { UserAuthLink } from "@/components/auth/user-auth-link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { isBlogArticlePath, PATHS } from "@/lib/paths";

import { HeaderMobileMenu } from "./header-mobile-menu";
import { HeaderNav } from "./header-nav";
import { HEADER_SCROLL_THRESHOLD_PX } from "./site-header.utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isBlogArticle = isBlogArticlePath(pathname);
  const isOverHero = isBlogArticle && !isScrolled && !isMenuOpen;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > HEADER_SCROLL_THRESHOLD_PX);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const headerClassName = isMenuOpen
    ? "sticky top-0 z-50 h-18 border-b border-[#ddd8ce] bg-[#f1eee5] text-zinc-950 transition-[background-color,border-color,box-shadow,color] duration-300 ease-out dark:border-[#282828] dark:bg-[#1a1919] dark:text-white"
    : isOverHero
      ? "sticky top-0 z-50 h-18 border-b border-transparent bg-transparent text-white transition-[background-color,border-color,box-shadow,color] duration-300 ease-out"
      : isScrolled
        ? "sticky top-0 z-50 h-18 border-b border-[#ddd8ce]/70 bg-[#f1eee5]/80 text-zinc-950 backdrop-blur-xl transition-[background-color,border-color,box-shadow,color] duration-300 ease-out dark:border-[#282828]/70 dark:bg-[#1a1919]/80 dark:text-white"
        : "sticky top-0 z-50 h-18 border-b border-[#ddd8ce] bg-[#f1eee5] text-zinc-950 transition-[background-color,border-color,box-shadow,color] duration-300 ease-out dark:border-[#282828] dark:bg-[#1a1919] dark:text-white";

  return (
    <header className={headerClassName}>
      <div className="flex h-full site-container-wide items-center justify-between gap-4 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-center">
        <Link
          href={PATHS.HOME}
          aria-label="Z AI na Ty - strona główna"
          className="text-current transition-colors hover:text-[#f24a00] xl:justify-self-start dark:hover:text-[#daff02]"
        >
          <BrandLogo className="h-[3.375rem] w-auto md:h-[3.75rem]" />
        </Link>

        <HeaderNav overHero={isOverHero} />

        <div className="flex shrink-0 items-center gap-2 sm:gap-3 xl:justify-self-end">
          <ThemeToggle />

          <div className="hidden items-center gap-2 xl:flex 2xl:gap-3">
            <Link
              href={PATHS.CONSULTATION}
              className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-[5px] border-2 border-[#f24a00] bg-transparent px-3.5 text-[13px] leading-none font-black text-[#f24a00] transition-transform hover:-translate-y-0.5 hover:scale-105 2xl:px-4 dark:border-[#daff02] dark:text-[#daff02]"
            >
              <CalendarIcon strokeWidth={2.2} className="size-3.5 shrink-0" />
              Konsultacja
            </Link>
            <Link
              href={PATHS.COURSES_TRAININGS}
              className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-[5px] bg-[#f24a00] px-4 text-[13px] leading-none font-black text-white shadow-[0_0_0_1px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-0.5 hover:scale-105 2xl:px-5 dark:bg-[#daff02] dark:text-zinc-950"
            >
              Zobacz kursy
            </Link>
          </div>

          <UserAuthLink overHero={isOverHero} />

          <HeaderMobileMenu onOpenChange={setIsMenuOpen} />
        </div>
      </div>
    </header>
  );
}
