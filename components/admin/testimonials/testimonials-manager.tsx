"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import {
  deleteTestimonial,
  listTestimonials,
} from "@/app/admin/actions/testimonials";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminLoading } from "@/components/admin/admin-loading";
import { adminSectionBodyClassName } from "@/components/admin/admin.utils";
import { useScrollAdminPanelWhen } from "@/components/admin/use-scroll-admin-panel";
import { AdminMessage, AdminPanelCard } from "@/components/admin/blog/blog-admin.shared";
import { Button } from "@/components/ui/button";
import type { Testimonial } from "@/lib/testimonials/types";

import { TestimonialForm } from "./testimonial-form";
import { TestimonialsSortableList } from "./testimonials-sortable-list";

export function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<Testimonial | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    const result = await listTestimonials();

    if (result.ok) {
      setItems(result.data);
      setError(null);
    } else {
      setError(result.error ?? "Nie udało się wczytać opinii.");
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
    toast.success(editingItem ? "Opinia zaktualizowana." : "Opinia dodana.");
    setError(null);
    closeForm();
    void loadItems();
  }

  function requestDelete(item: Testimonial) {
    setItemToDelete(item);
  }

  function confirmDelete() {
    if (!itemToDelete) return;

    const id = itemToDelete.id;
    setError(null);

    startTransition(async () => {
      const result = await deleteTestimonial(id);
      if (!result.ok) {
        setError(result.error ?? "Nie udało się usunąć opinii.");
        return;
      }

      setItemToDelete(null);
      if (editingItem?.id === id) closeForm();
      toast.success("Opinia usunięta.");
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
            Nowa opinia
          </Button>
        </div>
      ) : null}

      {showForm ? (
        <AdminPanelCard>
          <h2 className="text-lg font-black tracking-[0.02em]">
            {editingItem ? "Edytuj opinię" : "Nowa opinia"}
          </h2>
          <div className="mt-6">
            <TestimonialForm
              key={editingItem?.id ?? "new"}
              item={editingItem}
              onSaved={handleSaved}
              onCancel={closeForm}
            />
          </div>
        </AdminPanelCard>
      ) : null}

      {error ? <AdminMessage error={error} /> : null}

      <AdminPanelCard>
        <div>
          <h2 className="text-lg font-black tracking-[0.02em]">Lista opinii</h2>
          {items.length > 1 ? (
            <p className="mt-1 text-sm text-zinc-500">
              Przeciągnij opinie, aby ustawić kolejność na stronie głównej.
            </p>
          ) : null}
        </div>

        {isLoading ? (
          <AdminLoading label="Wczytywanie opinii..." />
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">Brak opinii.</p>
        ) : (
          <TestimonialsSortableList
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
        title="Usunąć opinię?"
        description={
          itemToDelete
            ? `Czy na pewno chcesz usunąć opinię od „${itemToDelete.author_name}"? Tej operacji nie można cofnąć.`
            : ""
        }
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
