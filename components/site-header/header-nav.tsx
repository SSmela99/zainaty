"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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

export function HeaderNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
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
      className="relative hidden items-center gap-9 justify-self-center lg:flex"
    >
      {headerNavItems.map((item, index) => {
        const isActive = isActiveNavItem(item, pathname);

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
                ? "py-2 text-[13px] font-black text-[#ff4b12] dark:text-[#d7ff00]"
                : "py-2 text-[13px] font-black text-current transition-colors hover:text-[#ff4b12] dark:hover:text-[#d7ff00]"
            }
          >
            {item.label}
          </Link>
        );
      })}
      <span
        aria-hidden="true"
        style={{
          left: underline.left,
          width: underline.width,
          opacity: underline.visible ? 1 : 0,
        }}
        className="pointer-events-none absolute -bottom-0.5 h-0.5 rounded-full bg-[#ff4b12] transition-all duration-300 ease-out dark:bg-[#d7ff00]"
      />
    </nav>
  );
}
