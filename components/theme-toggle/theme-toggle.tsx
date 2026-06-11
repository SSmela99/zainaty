"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { getNextTheme, startThemeTransition } from "./theme-toggle.utils";
import type { ThemeToggleState } from "./theme-toggle.utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  function toggleTheme() {
    startThemeTransition();
    setTheme(getNextTheme(resolvedTheme as ThemeToggleState));
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Przelacz motyw"
      onClick={toggleTheme}
      className="relative h-7 w-14 cursor-pointer rounded-full bg-zinc-200/70 transition-all duration-500 ease-out hover:scale-105 dark:bg-zinc-800/70"
    >
      <span className="absolute top-1 left-1 flex size-5 items-center justify-center rounded-full bg-[#ff4b12] shadow-md shadow-[#ff4b12]/30 transition-[translate,background-color,box-shadow] duration-500 ease-out dark:translate-x-7 dark:bg-[#d7ff00] dark:shadow-[#d7ff00]/40">
        <SunIcon
          strokeWidth={3}
          className="absolute size-3 rotate-0 scale-100 text-white opacity-100 transition-[opacity,rotate,scale] duration-500 ease-out dark:-rotate-180 dark:scale-0 dark:opacity-0"
        />
        <MoonIcon
          strokeWidth={3}
          className="absolute size-3 rotate-180 scale-0 text-zinc-950 opacity-0 transition-[opacity,rotate,scale] duration-500 ease-out dark:rotate-0 dark:scale-100 dark:opacity-100"
        />
      </span>
    </button>
  );
}
