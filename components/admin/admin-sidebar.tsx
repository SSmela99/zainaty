"use client";

import { LogOutIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";

import { logoutAction } from "@/app/admin/actions";
import { ThemeToggle } from "@/components/theme-toggle";

import {
  adminSections,
  sidebarRevealClass,
  type AdminSectionId,
} from "./admin.utils";

type AdminSidebarProps = {
  activeSection: AdminSectionId;
  collapsed: boolean;
  userEmail: string;
  onSectionChange: (sectionId: AdminSectionId) => void;
  onToggleCollapsed: () => void;
};

function getUserInitial(email: string) {
  return email.trim().charAt(0).toUpperCase() || "?";
}

export function AdminSidebar({
  activeSection,
  collapsed,
  userEmail,
  onSectionChange,
  onToggleCollapsed,
}: AdminSidebarProps) {
  const reveal = sidebarRevealClass(collapsed);

  return (
    <aside
      className={`flex h-dvh shrink-0 flex-col overflow-hidden border-r border-[#ddd8ce] bg-white transition-[width] duration-300 ease-out dark:border-[#282828] dark:bg-[#1c1c1c] ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="relative flex h-16 items-center border-b border-[#ddd8ce] px-3 dark:border-[#282828]">
        <p
          aria-hidden={collapsed}
          className={`text-sm font-black tracking-[0.02em] ${reveal}`}
        >
          Z AI na Ty
        </p>
        <button
          type="button"
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Rozwin menu" : "Zwin menu"}
          className={`inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-600 transition-colors hover:text-[#f24a00] dark:text-zinc-400 dark:hover:text-[#daff02] ${
            collapsed
              ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              : "ml-auto"
          }`}
        >
          {collapsed ? (
            <PanelLeftOpenIcon strokeWidth={2.2} className="size-5" />
          ) : (
            <PanelLeftCloseIcon strokeWidth={2.2} className="size-5" />
          )}
        </button>
      </div>

      <nav
        aria-label="Sekcje panelu admina"
        className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3"
      >
        {adminSections.map((section) => {
          const Icon = section.icon;
          const isActive = section.id === activeSection;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionChange(section.id)}
              title={collapsed ? section.label : undefined}
              className={
                isActive
                  ? `flex w-full cursor-pointer items-center rounded-xl bg-[#f24a00]/10 py-3 text-[#f24a00] dark:bg-[#daff02]/10 dark:text-[#daff02] ${
                      collapsed ? "justify-center px-0" : "px-3"
                    }`
                  : `flex w-full cursor-pointer items-center rounded-xl py-3 text-zinc-700 transition-colors hover:bg-[#f1eee5] hover:text-[#f24a00] dark:text-zinc-300 dark:hover:bg-[#151414] dark:hover:text-[#daff02] ${
                      collapsed ? "justify-center px-0" : "px-3"
                    }`
              }
            >
              <Icon strokeWidth={2.2} className="size-5 shrink-0" />
              <span
                className={`text-sm font-black ${collapsed ? "ml-0" : "ml-3"} ${reveal}`}
              >
                {section.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className={`shrink-0 ${collapsed ? "border-t border-[#ddd8ce] p-4 dark:border-[#282828]" : "p-3 pt-0"}`}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-5">
            <div
              className="flex size-9 items-center justify-center rounded-xl bg-[#dfe5ff] text-sm font-black text-[#0033ff] dark:bg-[#1a2a5e] dark:text-[#6688ff]"
              title={userEmail}
            >
              {getUserInitial(userEmail)}
            </div>

            <div className="flex w-full flex-col items-center gap-4">
              <ThemeToggle compact />

              <form action={logoutAction}>
                <button
                  type="submit"
                  title="Wyloguj"
                  aria-label="Wyloguj"
                  className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#0033ff]/30 bg-[#f1eee5] text-[#0033ff] transition-all hover:border-[#0033ff] hover:bg-[#dfe5ff] dark:border-[#6688ff]/30 dark:bg-[#151414] dark:text-[#6688ff] dark:hover:border-[#6688ff] dark:hover:bg-[#1a2a5e]"
                >
                  <LogOutIcon strokeWidth={2.2} className="size-3.5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#f1eee5] p-4 dark:bg-[#151414]">
            <div className="flex items-center gap-3" title={userEmail}>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#dfe5ff] text-sm font-black text-[#0033ff] dark:bg-[#1a2a5e] dark:text-[#6688ff]">
                {getUserInitial(userEmail)}
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-bold tracking-[0.16em] text-zinc-500 uppercase dark:text-zinc-500">
                  Konto
                </p>
                <p className="truncate text-sm font-bold text-zinc-950 dark:text-white">
                  {userEmail}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 rounded-xl bg-white px-3 py-2.5 dark:bg-[#1c1c1c]">
              <ThemeToggle />

              <span
                aria-hidden="true"
                className="h-5 w-px shrink-0 bg-[#ddd8ce] dark:bg-[#282828]"
              />

              <form action={logoutAction}>
                <button
                  type="submit"
                  title="Wyloguj"
                  aria-label="Wyloguj"
                  className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg border border-[#0033ff]/30 bg-transparent text-[#0033ff] transition-all hover:border-[#0033ff] hover:bg-[#dfe5ff] dark:border-[#6688ff]/30 dark:text-[#6688ff] dark:hover:border-[#6688ff] dark:hover:bg-[#1a2a5e]"
                >
                  <LogOutIcon strokeWidth={2.2} className="size-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
