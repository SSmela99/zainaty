"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { deleteFaqItem, listFaqItems } from "@/app/admin/actions/faq";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminLoading } from "@/components/admin/admin-loading";
import { adminSectionBodyClassName } from "@/components/admin/admin.utils";
import { useScrollAdminPanelWhen } from "@/components/admin/use-scroll-admin-panel";
import { AdminMessage, AdminPanelCard } from "@/components/admin/blog/blog-admin.shared";
import { Button } from "@/components/ui/button";
import type { FaqItem } from "@/lib/faq/types";

import { FaqItemForm } from "./faq-item-form";
import { FaqSortableList } from "./faq-sortable-list";

export function FaqItemsManager() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<FaqItem | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    const result = await listFaqItems();
    if (result.ok) {
      setItems(result.data);
    } else {
      setError(result.error ?? "Nie udało się wczytać pytań FAQ.");
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
    toast.success(editingItem ? "Pytanie zaktualizowane." : "Pytanie dodane.");
    setError(null);
    closeForm();
    void loadItems();
  }

  function requestDelete(item: FaqItem) {
    setItemToDelete(item);
  }

  function confirmDelete() {
    if (!itemToDelete) return;

    const id = itemToDelete.id;
    setError(null);

    startTransition(async () => {
      const result = await deleteFaqItem(id);
      if (!result.ok) {
        setError(result.error ?? "Nie udało się usunąć pytania.");
        return;
      }

      setItemToDelete(null);
      if (editingItem?.id === id) closeForm();
      toast.success("Pytanie usunięte.");
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
            Nowe pytanie
          </Button>
        </div>
      ) : null}

      {showForm ? (
        <AdminPanelCard>
          <h2 className="text-lg font-black tracking-[-0.02em]">
            {editingItem ? "Edytuj pytanie" : "Nowe pytanie"}
          </h2>
          <div className="mt-6">
            <FaqItemForm
              item={editingItem}
              onSaved={handleSaved}
              onCancel={closeForm}
            />
          </div>
        </AdminPanelCard>
      ) : null}

      {error ? <AdminMessage error={error} /> : null}

      <AdminPanelCard>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-black tracking-[-0.02em]">Lista pytań</h2>
            {items.length > 1 ? (
              <p className="mt-1 text-sm text-zinc-500">
                Przeciągnij pytania, aby ustawić kolejność na stronie FAQ.
              </p>
            ) : null}
          </div>
        </div>

        {isLoading ? (
          <AdminLoading label="Wczytywanie pytań..." />
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">Brak pytań FAQ.</p>
        ) : (
          <FaqSortableList
            items={items}
            disabled={isPending}
            onEdit={(item) => {
              setEditingItem(item);
              setIsCreating(false);
              setError(null);
            }}
            onDelete={requestDelete}
            onReorderFailed={loadItems}
          />
        )}
      </AdminPanelCard>

      <AdminConfirmDialog
        open={itemToDelete != null}
        onOpenChange={(open) => {
          if (!open && !isPending) setItemToDelete(null);
        }}
        title="Usunąć pytanie?"
        description={
          itemToDelete
            ? `Czy na pewno chcesz usunąć pytanie „${itemToDelete.question}"? Tej operacji nie można cofnąć.`
            : ""
        }
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
