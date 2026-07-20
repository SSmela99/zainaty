"use client";

import type { User } from "@supabase/supabase-js";
import { useState } from "react";

import { AdminSectionContent } from "./admin-section-content";
import { AdminSidebar } from "./admin-sidebar";
import { getAdminSection, ADMIN_PANEL_MAIN_ID, type AdminSectionId } from "./admin.utils";

type AdminShellProps = {
  user: User;
};

export function AdminShell({ user }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSectionId>("blog");

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <AdminSidebar
        activeSection={activeSection}
        collapsed={collapsed}
        userEmail={user.email ?? ""}
        onSectionChange={setActiveSection}
        onToggleCollapsed={() => setCollapsed((value) => !value)}
      />

      <main
        id={ADMIN_PANEL_MAIN_ID}
        className="min-h-0 flex-1 overflow-y-auto bg-[#f1eee5] px-6 py-8 md:px-10 md:py-10 dark:bg-[#1a1919]"
      >
        <AdminSectionContent
          section={getAdminSection(activeSection)}
          userEmail={user.email ?? ""}
        />
      </main>
    </div>
  );
}
