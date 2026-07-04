"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  createTag,
  deleteTag,
  listTags,
  updateTag,
} from "@/app/admin/actions/blog";
import { scrollAdminPanelToTop } from "@/components/admin/admin.utils";
import {
  AdminFormField,
  adminInputClassName,
} from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tagSchema, type TagFormValues } from "@/lib/validation/admin-blog.schemas";
import type { Tag } from "@/lib/blog/types";

import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminLoading } from "@/components/admin/admin-loading";
import { AdminMessage, AdminPanelCard } from "./blog-admin.shared";

export function BlogTagsManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TagFormValues>({
    resolver: yupResolver(tagSchema),
    defaultValues: { name: "" },
  });

  const loadTags = useCallback(async () => {
    setIsLoading(true);
    const result = await listTags();
    if (result.ok) {
      setTags(result.data);
    } else {
      setError(result.error ?? "Nie udało się wczytać tagów.");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadTags();
  }, [loadTags]);

  function resetFormState() {
    reset({ name: "" });
    setEditingId(null);
  }

  function startEdit(tag: Tag) {
    setEditingId(tag.id);
    reset({ name: tag.name });
    setError(null);
    scrollAdminPanelToTop();
  }

  const onSubmit = handleSubmit((values) => {
    setError(null);

    startTransition(async () => {
      const result = editingId
        ? await updateTag(editingId, values)
        : await createTag(values);

      if (!result.ok) {
        setError(result.error ?? "Operacja nie powiodła się.");
        return;
      }

      toast.success(editingId ? "Tag zaktualizowany." : "Tag dodany.");
      resetFormState();
      await loadTags();
    });
  });

  function requestDelete(tag: Tag) {
    setTagToDelete(tag);
  }

  function confirmDelete() {
    if (!tagToDelete) return;

    const id = tagToDelete.id;
    setError(null);

    startTransition(async () => {
      const result = await deleteTag(id);
      if (!result.ok) {
        setError(result.error ?? "Nie udało się usunąć tagu.");
        return;
      }

      setTagToDelete(null);
      if (editingId === id) resetFormState();
      toast.success("Tag usunięty.");
      await loadTags();
    });
  }

  return (
    <div className="space-y-6">
      <AdminPanelCard>
        <h2 className="text-lg font-black tracking-[-0.02em]">
          {editingId ? "Edytuj tag" : "Nowy tag"}
        </h2>

        <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
          <AdminFormField
            label="Nazwa"
            htmlFor="tag-name"
            error={errors.name?.message}
            required
          >
            <Input
              id="tag-name"
              placeholder="np. sztuczna inteligencja"
              aria-invalid={Boolean(errors.name)}
              className={adminInputClassName(Boolean(errors.name))}
              {...register("name")}
            />
          </AdminFormField>

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 bg-[#ff4b12] px-5 text-white hover:bg-[#e6430f] dark:bg-[#d7ff00] dark:text-black dark:hover:bg-[#c4eb00]"
            >
              {editingId ? "Zapisz zmiany" : "Dodaj tag"}
            </Button>
            {editingId ? (
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={resetFormState}
              >
                Anuluj
              </Button>
            ) : null}
          </div>
        </form>

        <div className="mt-4 space-y-3">
          <AdminMessage error={error} />
        </div>
      </AdminPanelCard>

      <AdminPanelCard>
        <h2 className="text-lg font-black tracking-[-0.02em]">Lista tagów</h2>

        {isLoading ? (
          <AdminLoading label="Wczytywanie tagów..." />
        ) : tags.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">Brak tagów.</p>
        ) : (
          <ul className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag.id}
                className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 py-1 pr-1 pl-3 dark:border-zinc-700 dark:bg-zinc-900"
              >
                <span className="text-sm font-medium">{tag.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  disabled={isPending}
                  onClick={() => startEdit(tag)}
                  aria-label={`Edytuj tag ${tag.name}`}
                >
                  <PencilIcon />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  disabled={isPending}
                  onClick={() => requestDelete(tag)}
                  aria-label={`Usuń tag ${tag.name}`}
                >
                  <Trash2Icon />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </AdminPanelCard>

      <AdminConfirmDialog
        open={tagToDelete != null}
        onOpenChange={(open) => {
          if (!open && !isPending) setTagToDelete(null);
        }}
        title="Usunąć tag?"
        description={
          tagToDelete
            ? `Czy na pewno chcesz usunąć tag „${tagToDelete.name}"? Tej operacji nie można cofnąć.`
            : ""
        }
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
