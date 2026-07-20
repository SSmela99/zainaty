"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { NavLink } from "@/lib/paths";

import { HeaderCoursesMenu } from "./header-courses-menu";
import { headerNavItems, isActiveNavItem } from "./site-header.utils";

type UnderlinePosition = {
  left: number;
  width: number;
  visible: boolean;
};

const INITIAL_UNDERLINE: UnderlinePosition = {
  left: 0,
  width: 0,
  visible: false,
};

export function HeaderNav({ overHero = false }: { overHero?: boolean }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Array<HTMLElement | null>>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [underline, setUnderline] =
    useState<UnderlinePosition>(INITIAL_UNDERLINE);

  const activeIndex = headerNavItems.findIndex((item) =>
    isActiveNavItem(item, pathname),
  );
  const targetIndex = hoverIndex ?? activeIndex;

  useEffect(() => {
    const measure = () => {
      if (targetIndex < 0) {
        setUnderline((prev) =>
          prev.visible ? { ...prev, visible: false } : prev,
        );
        return;
      }

      const navEl = navRef.current;
      const linkEl = linkRefs.current[targetIndex];
      if (!navEl || !linkEl) return;

      const navRect = navEl.getBoundingClientRect();
      const linkRect = linkEl.getBoundingClientRect();
      setUnderline({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
        visible: true,
      });
    };

    measure();
    window.addEventListener("resize", measure);

    return () => {
      window.removeEventListener("resize", measure);
    };
  }, [targetIndex]);

  return (
    <nav
      ref={navRef}
      aria-label="Glowne menu"
      onMouseLeave={() => setHoverIndex(null)}
      className="relative hidden items-center gap-9 justify-self-center xl:flex"
    >
      {headerNavItems.map((item, index) => {
        const isActive = isActiveNavItem(item, pathname);

        if (item.children?.length) {
          return (
            <HeaderCoursesMenu
              key={item.label}
              item={item as NavLink & { children: NonNullable<NavLink["children"]> }}
              overHero={overHero}
              isActive={isActive}
              ref={(el) => {
                linkRefs.current[index] = el;
              }}
              onMouseEnter={() => setHoverIndex(index)}
            />
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            ref={(el) => {
              linkRefs.current[index] = el;
            }}
            aria-current={isActive ? "page" : undefined}
            onMouseEnter={() => setHoverIndex(index)}
            className={
              isActive
                ? overHero
                  ? "py-2 text-[13px] font-black text-[#f24a00] dark:text-[#daff02]"
                  : "py-2 text-[13px] font-black text-[#f24a00] dark:text-[#daff02]"
                : overHero
                  ? "py-2 text-[13px] font-black text-white/90 transition-colors hover:text-[#f24a00] dark:hover:text-[#daff02]"
                  : "py-2 text-[13px] font-black text-current transition-colors hover:text-[#f24a00] dark:hover:text-[#daff02]"
            }
          >
            {item.label}
          </Link>
        );
      })}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-0.5 h-0.5 rounded-full bg-[#f24a00] transition-all duration-300 ease-out dark:bg-[#daff02]"
        style={{
          left: underline.left,
          width: underline.width,
          opacity: underline.visible ? 1 : 0,
        }}
      />
    </nav>
  );
}
