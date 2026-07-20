"use client";

import { SearchIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { listUsers } from "@/app/admin/actions/users";
import { AdminLoading } from "@/components/admin/admin-loading";
import { adminSectionBodyClassName } from "@/components/admin/admin.utils";
import { AdminMessage, AdminPanelCard } from "@/components/admin/blog/blog-admin.shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminUser } from "@/lib/users/types";
import { cn } from "@/lib/utils";

import { UserRow } from "./user-row";
import { USER_ROW_GRID_CLASS } from "./user-row.utils";
import {
  formatUsersCount,
  getTotalPages,
  USERS_PAGE_SIZE,
} from "@/lib/users/constants";

const SEARCH_DEBOUNCE_MS = 300;

export function UsersManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const totalPages = getTotalPages(total, USERS_PAGE_SIZE);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);

    const result = await listUsers({
      search: searchQuery,
      page,
      pageSize: USERS_PAGE_SIZE,
    });

    if (result.ok) {
      setUsers(result.data.items);
      setTotal(result.data.total);

      if (result.data.page > getTotalPages(result.data.total, USERS_PAGE_SIZE)) {
        setPage(getTotalPages(result.data.total, USERS_PAGE_SIZE));
      }

      setError(null);
    } else {
      setError(result.error ?? "Nie udało się wczytać użytkowników.");
    }

    setIsLoading(false);
  }, [page, searchQuery]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearchQuery(searchInput.trim());
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  return (
    <div className={adminSectionBodyClassName}>
      <AdminMessage error={error} />

      <AdminPanelCard className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 border-b border-[#ddd8ce] px-6 py-4 dark:border-[#282828] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-zinc-950 dark:text-white">
            {formatUsersCount(total)}
            {searchQuery ? (
              <span className="ml-2 font-medium text-zinc-500">
                (filtr: „{searchQuery}”)
              </span>
            ) : null}
          </p>

          <div className="relative w-full sm:max-w-sm">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400"
              strokeWidth={2.2}
            />
            <Input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Szukaj po e-mailu..."
              className="h-11 rounded-xl border-zinc-200 bg-white pl-10 text-sm dark:border-zinc-700 dark:bg-[#151414]"
            />
          </div>
        </div>

        {isLoading ? (
          <AdminLoading label="Wczytywanie użytkowników..." />
        ) : users.length === 0 ? (
          <p className="px-6 py-10 text-sm text-zinc-600 dark:text-zinc-400">
            {searchQuery
              ? "Brak użytkowników pasujących do wyszukiwania."
              : "Brak użytkowników do wyświetlenia."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div
                className={cn(
                  USER_ROW_GRID_CLASS,
                  "border-b border-[#ddd8ce] bg-[#f5f2e9] px-6 py-3 text-xs font-bold tracking-[0.12em] text-zinc-500 uppercase dark:border-[#282828] dark:bg-[#151414] dark:text-zinc-400",
                )}
              >
                <span>E-mail</span>
                <span>Rola</span>
                <span>Rejestracja</span>
                <span>Ostatnie logowanie</span>
                <span aria-hidden="true" />
              </div>

              {users.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}

        {!isLoading && total > 0 ? (
          <div className="flex flex-col gap-3 border-t border-[#ddd8ce] px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-[#282828]">
            <p className="text-sm text-zinc-500">
              Strona {page} z {totalPages}
            </p>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((current) => Math.max(current - 1, 1))}
                className="rounded-xl"
              >
                Poprzednia
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= totalPages || isLoading}
                onClick={() =>
                  setPage((current) => Math.min(current + 1, totalPages))
                }
                className="rounded-xl"
              >
                Następna
              </Button>
            </div>
          </div>
        ) : null}
      </AdminPanelCard>
    </div>
  );
}
