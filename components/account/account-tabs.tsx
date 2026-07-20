"use client";

import { cn } from "@/lib/utils";

import {
  ACCOUNT_TABS,
  type AccountTabId,
} from "./account-page.utils";

type AccountTabsProps = {
  activeTab: AccountTabId;
  onTabChange: (tab: AccountTabId) => void;
};

export function AccountTabs({ activeTab, onTabChange }: AccountTabsProps) {
  return (
    <nav
      aria-label="Zakładki konta"
      className="flex gap-1 border-b border-[#ddd8ce] dark:border-[#282828]"
    >
      {ACCOUNT_TABS.map((tab) => {
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
