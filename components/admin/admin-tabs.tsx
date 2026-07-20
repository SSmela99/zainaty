"use client";

import { cn } from "@/lib/utils";

export type AdminTabItem<T extends string> = {
  id: T;
  label: string;
};

type AdminTabsProps<T extends string> = {
  tabs: readonly AdminTabItem<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  ariaLabel: string;
};

export function AdminTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel,
}: AdminTabsProps<T>) {
  return (
    <nav
      aria-label={ariaLabel}
      className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "-mb-px cursor-pointer border-b-2 px-4 py-3 text-sm font-bold transition-colors",
              isActive
                ? "border-[#f24a00] text-[#f24a00] dark:border-[#daff02] dark:text-[#daff02]"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
