"use client";

import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

import type { AdminUser } from "@/lib/users/types";
import { cn } from "@/lib/utils";

import { UserCoursesPanel } from "./user-courses-panel";
import { USER_ROW_GRID_CLASS } from "./user-row.utils";

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function RoleBadge({ role }: { role: AdminUser["role"] }) {
  const isAdmin = role === "admin";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-[0.08em]",
        isAdmin
          ? "bg-[#dfe5ff] text-[#1a4dff] dark:bg-[#1a2a5e] dark:text-[#7d9bff]"
          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
      )}
    >
      {isAdmin ? "Admin" : "Użytkownik"}
    </span>
  );
}

type UserRowProps = {
  user: AdminUser;
};

export function UserRow({ user }: UserRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details
      className="group border-b border-[#ded9cf] last:border-b-0 dark:border-[#282828]"
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary
        className={cn(
          USER_ROW_GRID_CLASS,
          "cursor-pointer list-none px-6 py-4 text-sm text-zinc-800 transition-colors hover:bg-[#f7f3ea]/60 dark:text-zinc-200 dark:hover:bg-[#141414]/60 [&::-webkit-details-marker]:hidden",
        )}
      >
        <span className="truncate font-medium text-zinc-950 dark:text-white">
          {user.email}
        </span>
        <span>
          <RoleBadge role={user.role} />
        </span>
        <span className="whitespace-nowrap">{formatDate(user.created_at)}</span>
        <span className="whitespace-nowrap">
          {formatDate(user.last_sign_in_at)}
        </span>
        <ChevronDownIcon
          className="size-4 justify-self-end text-zinc-400 transition-transform group-open:rotate-180"
          strokeWidth={2.2}
        />
      </summary>

      <UserCoursesPanel userId={user.id} isActive={isOpen} />
    </details>
  );
}
