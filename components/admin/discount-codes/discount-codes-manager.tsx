"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import {
  deleteDiscountCode,
  listDiscountCodes,
} from "@/app/admin/actions/discount-codes";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminLoading } from "@/components/admin/admin-loading";
import { adminSectionBodyClassName } from "@/components/admin/admin.utils";
import { useScrollAdminPanelWhen } from "@/components/admin/use-scroll-admin-panel";
import { AdminMessage, AdminPanelCard } from "@/components/admin/blog/blog-admin.shared";
import { Button } from "@/components/ui/button";
import type { DiscountCode } from "@/lib/discount-codes/types";

import { DiscountCodeForm } from "./discount-code-form";
import { DiscountCodesList } from "./discount-codes-list";

export function DiscountCodesManager() {
  const [items, setItems] = useState<DiscountCode[]>([]);
  const [editingItem, setEditingItem] = useState<DiscountCode | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<DiscountCode | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    const result = await listDiscountCodes();

    if (result.ok) {
      setItems(result.data);
    } else {
      setError(result.error ?? "Nie udało się wczytać kodów rabatowych.");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  function closeForm() {
    setEditingItem(null);
    setIsCreating(false);
  }

  function handleSaved() {
    toast.success(editingItem ? "Kod zaktualizowany." : "Kod dodany.");
    setError(null);
    closeForm();
    void loadItems();
  }

  function confirmDelete() {
    if (!itemToDelete) return;

    const id = itemToDelete.id;
    setError(null);

    startTransition(async () => {
      const result = await deleteDiscountCode(id);

      if (!result.ok) {
        setError(result.error ?? "Nie udało się usunąć kodu.");
        return;
      }

      setItemToDelete(null);
      if (editingItem?.id === id) closeForm();
      toast.success("Kod usunięty.");
      await loadItems();
    });
  }

  const showForm = isCreating || editingItem != null;

  useScrollAdminPanelWhen(showForm);

  return (
    <div className={adminSectionBodyClassName}>
      {!showForm ? (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => {
              setIsCreating(true);
              setError(null);
            }}
            className="h-10 bg-[#f24a00] px-5 text-white hover:bg-[#d94200] dark:bg-[#daff02] dark:text-black dark:hover:bg-[#9bec00]"
          >
            <PlusIcon />
            Nowy kod rabatowy
          </Button>
        </div>
      ) : null}

      {showForm ? (
        <AdminPanelCard>
          <h2 className="text-lg font-black tracking-[0.02em]">
            {editingItem ? "Edytuj kod rabatowy" : "Nowy kod rabatowy"}
          </h2>
          <div className="mt-6">
            <DiscountCodeForm
              item={editingItem}
              onSaved={handleSaved}
              onCancel={closeForm}
            />
          </div>
        </AdminPanelCard>
      ) : null}

      {error ? <AdminMessage error={error} /> : null}

      <AdminPanelCard>
        <h2 className="text-lg font-black tracking-[0.02em]">Lista kodów</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Kody można wpisać na stronie zakupu kursu. Limit użyć rośnie po udanej płatności.
        </p>

        {isLoading ? (
          <AdminLoading label="Wczytywanie kodów..." />
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">Brak kodów rabatowych.</p>
        ) : (
          <DiscountCodesList
            items={items}
            disabled={isPending}
            onEdit={(item) => {
              setEditingItem(item);
              setIsCreating(false);
              setError(null);
            }}
            onDelete={setItemToDelete}
          />
        )}
      </AdminPanelCard>

      <AdminConfirmDialog
        open={itemToDelete != null}
        onOpenChange={(open) => {
          if (!open && !isPending) setItemToDelete(null);
        }}
        title="Usunąć kod rabatowy?"
        description={
          itemToDelete
            ? `Czy na pewno chcesz usunąć kod „${itemToDelete.code}"?`
            : ""
        }
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
