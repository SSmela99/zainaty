"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { getNextTheme, startThemeTransition } from "./theme-toggle.utils";
import type { ThemeToggleState } from "./theme-toggle.utils";

const toggleClassName =
  "relative cursor-pointer rounded-full bg-zinc-200/70 transition-all duration-500 ease-out hover:scale-105 dark:bg-zinc-800/70";

const knobClassName =
  "absolute top-1 left-1 flex items-center justify-center rounded-full bg-[#f24a00] shadow-md shadow-[#f24a00]/30 transition-[translate,background-color,box-shadow] duration-500 ease-out dark:bg-[#daff02] dark:shadow-[#daff02]/40";

type ThemeToggleProps = {
  compact?: boolean;
};

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

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
      className={`${toggleClassName} ${compact ? "h-6 w-11" : "h-7 w-14"}`}
    >
      <span
        className={`${knobClassName} ${compact ? "size-4 dark:translate-x-5" : "size-5 dark:translate-x-7"}`}
      >
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
