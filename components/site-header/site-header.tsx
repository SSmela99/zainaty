"use client";

import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { handleConsultationRedirect } from "@/lib/consultation";
import { PATHS } from "@/lib/paths";

import { HeaderMobileMenu } from "./header-mobile-menu";
import { HeaderNav } from "./header-nav";
import { HEADER_SCROLL_THRESHOLD_PX } from "./site-header.utils";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

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

  return (
    <header
      className={
        isScrolled
          ? "sticky top-0 z-50 h-18 border-b border-[#ded9cf]/70 bg-[#f2efe6]/80 text-zinc-950 backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-300 ease-out dark:border-[#282828]/70 dark:bg-[#111111]/80 dark:text-white"
          : "sticky top-0 z-50 h-18 border-b border-[#ded9cf] bg-[#f2efe6] text-zinc-950 transition-[background-color,border-color,box-shadow] duration-300 ease-out dark:border-[#282828] dark:bg-[#111111] dark:text-white"
      }
    >
      <div className="mx-auto flex h-full max-w-410 items-center justify-between gap-4 px-8 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <Link
          href={PATHS.HOME}
          className="text-2xl font-black tracking-[-0.04em] text-current transition-colors hover:text-[#ff4b12] lg:justify-self-start dark:hover:text-[#d7ff00]"
        >
          Z AI na Ty
        </Link>

        <HeaderNav />

        <div className="flex items-center gap-3 lg:justify-self-end">
          <ThemeToggle />

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={handleConsultationRedirect}
              className="inline-flex cursor-pointer items-center gap-2 rounded-[5px] border-2 border-[#ff4b12] bg-transparent px-4 py-2.5 text-[13px] leading-none font-black text-[#ff4b12] transition-transform hover:-translate-y-0.5 hover:scale-105 dark:border-[#d7ff00] dark:text-[#d7ff00]"
            >
              <CalendarIcon strokeWidth={2.2} className="size-3.5" />
              Konsultacja
            </button>
            <Link
              href={PATHS.EBOOKS}
              className="cursor-pointer rounded-[5px] bg-[#ff4b12] px-5 py-3 text-[13px] leading-none font-black text-white shadow-[0_0_0_1px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-0.5 hover:scale-105 dark:bg-[#d7ff00] dark:text-zinc-950"
            >
              Zobacz e-booki
            </Link>
          </div>

          <HeaderMobileMenu />
        </div>
      </div>
    </header>
  );
}
