"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import {
  deleteFreeMaterial,
  listFreeMaterialTags,
  listFreeMaterials,
} from "@/app/admin/actions/free-materials";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminLoading } from "@/components/admin/admin-loading";
import { useScrollAdminPanelWhen } from "@/components/admin/use-scroll-admin-panel";
import {
  AdminMessage,
  AdminPanelCard,
} from "@/components/admin/blog/blog-admin.shared";
import { Button } from "@/components/ui/button";
import type { FreeMaterial, FreeMaterialTag } from "@/lib/free-materials/types";

import { FreeMaterialForm } from "./free-material-form";
import { FreeMaterialsList } from "./free-materials-list";

export function FreeMaterialsManager() {
  const [items, setItems] = useState<FreeMaterial[]>([]);
  const [tags, setTags] = useState<FreeMaterialTag[]>([]);
  const [editingItem, setEditingItem] = useState<FreeMaterial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<FreeMaterial | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    const [materialsResult, tagsResult] = await Promise.all([
      listFreeMaterials(),
      listFreeMaterialTags(),
    ]);

    if (materialsResult.ok) {
      setItems(materialsResult.data);
      setError(null);
    } else {
      setError(materialsResult.error ?? "Nie udało się wczytać materiałów.");
    }

    if (tagsResult.ok) {
      setTags(tagsResult.data);
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
    toast.success(
      editingItem ? "Materiał zaktualizowany." : "Materiał dodany.",
    );
    setError(null);
    closeForm();
    void loadItems();
  }

  function requestDelete(item: FreeMaterial) {
    setItemToDelete(item);
  }

  function confirmDelete() {
    if (!itemToDelete) return;

    const id = itemToDelete.id;
    setError(null);

    startTransition(async () => {
      const result = await deleteFreeMaterial(id);
      if (!result.ok) {
        setError(result.error ?? "Nie udało się usunąć materiału.");
        return;
      }

      setItemToDelete(null);
      if (editingItem?.id === id) closeForm();
      toast.success("Materiał usunięty.");
      await loadItems();
    });
  }

  const showForm = isCreating || editingItem != null;

  useScrollAdminPanelWhen(showForm);

  return (
    <div className="space-y-6">
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
            Nowy materiał
          </Button>
        </div>
      ) : null}

      {showForm ? (
        <AdminPanelCard>
          <h2 className="text-lg font-black tracking-[-0.02em]">
            {editingItem ? "Edytuj materiał" : "Nowy materiał"}
          </h2>
          <div className="mt-6">
            <FreeMaterialForm
              key={editingItem?.id ?? "new"}
              item={editingItem}
              tags={tags}
              onSaved={handleSaved}
              onCancel={closeForm}
            />
          </div>
        </AdminPanelCard>
      ) : null}

      {error ? <AdminMessage error={error} /> : null}

      <AdminPanelCard>
        <div>
          <h2 className="text-lg font-black tracking-[-0.02em]">
            Lista materiałów
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Zdjęcie, tytuł, opis, tag i plik / wideo.
          </p>
        </div>

        {isLoading ? (
          <AdminLoading label="Wczytywanie materiałów..." />
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">Brak materiałów.</p>
        ) : (
          <FreeMaterialsList
            items={items}
            disabled={isPending}
            onEdit={(item) => {
              setEditingItem(item);
              setIsCreating(false);
              setError(null);
            }}
            onDelete={requestDelete}
          />
        )}
      </AdminPanelCard>

      <AdminConfirmDialog
        open={itemToDelete != null}
        onOpenChange={(open) => {
          if (!open && !isPending) setItemToDelete(null);
        }}
        title="Usunąć materiał?"
        description={
          itemToDelete
            ? `Czy na pewno chcesz usunąć „${itemToDelete.title}"? Tej operacji nie można cofnąć.`
            : ""
        }
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
