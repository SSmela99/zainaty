"use client";

import {
  BookOpenIcon,
  ChevronUpIcon,
  LayersIcon,
  type LucideIcon,
  VideoIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, useState } from "react";

import type { CourseNavChild, NavLink } from "@/lib/paths";
import { cn } from "@/lib/utils";

import { courseNavIconByHref } from "./header-courses-menu.utils";

const courseNavIcons: Record<
  (typeof courseNavIconByHref)[CourseNavChild["href"]],
  LucideIcon
> = {
  book: BookOpenIcon,
  video: VideoIcon,
  layers: LayersIcon,
};

type HeaderCoursesMenuProps = {
  item: NavLink & { children: readonly CourseNavChild[] };
  overHero?: boolean;
  isActive: boolean;
  onMouseEnter?: () => void;
};

export const HeaderCoursesMenu = forwardRef<
  HTMLButtonElement,
  HeaderCoursesMenuProps
>(function HeaderCoursesMenu(
  { item, overHero = false, isActive, onMouseEnter },
  ref,
) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const triggerClassName = isActive
    ? "py-2 text-[13px] font-black text-[#ff4b12] dark:text-[#d7ff00]"
    : overHero
      ? "py-2 text-[13px] font-black text-white/90 transition-colors hover:text-[#ff4b12] dark:hover:text-[#d7ff00]"
      : "py-2 text-[13px] font-black text-current transition-colors hover:text-[#ff4b12] dark:hover:text-[#d7ff00]";

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        setIsOpen(true);
        onMouseEnter?.();
      }}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn("inline-flex cursor-pointer items-center gap-1", triggerClassName)}
      >
        {item.label}
        <ChevronUpIcon
          strokeWidth={2.5}
          className={cn(
            "size-3.5 transition-transform duration-300",
            isOpen ? "rotate-0" : "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "absolute top-full left-1/2 z-50 pt-3 -translate-x-1/2 transition-all duration-200",
          isOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0",
        )}
      >
        <div className="min-w-56 rounded-2xl border border-[#ded9cf] bg-white p-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:border-[#333333] dark:bg-[#1c1c1c] dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          {item.children.map((child) => {
            const Icon = courseNavIcons[courseNavIconByHref[child.href]];
            const isChildActive = pathname === child.href;

            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-colors",
                  isChildActive
                    ? "bg-[#ffe1cc] text-[#ff4b12] dark:bg-[#3a3d10] dark:text-[#d7ff00]"
                    : "text-zinc-900 hover:bg-[#f7f3ea] dark:text-white dark:hover:bg-[#252525]",
                )}
              >
                <Icon strokeWidth={2.2} className="size-5 shrink-0" />
                {child.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
});
