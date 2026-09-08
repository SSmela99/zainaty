"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { ExternalLinkIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  createFreeMaterialLink,
  deleteFreeMaterialLink,
  listFreeMaterialLinks,
  updateFreeMaterialLink,
} from "@/app/admin/actions/free-materials";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminLoading } from "@/components/admin/admin-loading";
import { scrollAdminPanelToTop } from "@/components/admin/admin.utils";
import {
  AdminMessage,
  AdminPanelCard,
} from "@/components/admin/blog/blog-admin.shared";
import {
  AdminFormField,
  adminInputClassName,
  adminTextareaClassName,
} from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FreeMaterialLink } from "@/lib/free-materials/types";
import {
  freeMaterialLinkSchema,
  type FreeMaterialLinkFormValues,
} from "@/lib/validation/admin-free-materials.schemas";

const emptyValues: FreeMaterialLinkFormValues = {
  title: "",
  url: "",
  description: "",
  published: true,
};

export function FreeMaterialLinksManager() {
  const [items, setItems] = useState<FreeMaterialLink[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<FreeMaterialLink | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FreeMaterialLinkFormValues>({
    resolver: yupResolver(freeMaterialLinkSchema),
    defaultValues: emptyValues,
  });

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    const result = await listFreeMaterialLinks();
    if (result.ok) {
      setItems(result.data);
      setError(null);
    } else {
      setError(result.error ?? "Nie udało się wczytać linków.");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  function closeForm() {
    reset(emptyValues);
    setEditingId(null);
    setIsCreating(false);
  }

  function startCreate() {
    reset(emptyValues);
    setEditingId(null);
    setIsCreating(true);
    setError(null);
    scrollAdminPanelToTop();
  }

  function startEdit(item: FreeMaterialLink) {
    setIsCreating(false);
    setEditingId(item.id);
    reset({
      title: item.title,
      url: item.url,
      description: item.description,
      published: item.published,
    });
    setError(null);
    scrollAdminPanelToTop();
  }

  const showForm = isCreating || editingId != null;

  const onSubmit = handleSubmit((values) => {
    setError(null);

    startTransition(async () => {
      const result = editingId
        ? await updateFreeMaterialLink(editingId, values)
        : await createFreeMaterialLink(values);

      if (!result.ok) {
        setError(result.error ?? "Operacja nie powiodła się.");
        return;
      }

      toast.success(editingId ? "Link zaktualizowany." : "Link dodany.");
      closeForm();
      await loadItems();
    });
  });

  function confirmDelete() {
    if (!itemToDelete) return;

    const id = itemToDelete.id;
    setError(null);

    startTransition(async () => {
      const result = await deleteFreeMaterialLink(id);
      if (!result.ok) {
        setError(result.error ?? "Nie udało się usunąć linku.");
        return;
      }

      setItemToDelete(null);
      if (editingId === id) closeForm();
      toast.success("Link usunięty.");
      await loadItems();
    });
  }

  return (
    <div className="space-y-6">
      {!showForm ? (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={startCreate}
            className="h-10 bg-[#f24a00] px-5 text-white hover:bg-[#d94200] dark:bg-[#daff02] dark:text-black dark:hover:bg-[#9bec00]"
          >
            <PlusIcon />
            Nowy link
          </Button>
        </div>
      ) : null}

      {showForm ? (
        <AdminPanelCard>
          <h2 className="text-lg font-black tracking-[0.02em]">
            {editingId ? "Edytuj link" : "Nowy link"}
          </h2>

          <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
            <AdminFormField
              label="Tytuł"
              htmlFor="free-material-link-title"
              error={errors.title?.message}
              required
            >
              <Input
                id="free-material-link-title"
                placeholder="np. Promptbase - biblioteka promptów"
                aria-invalid={Boolean(errors.title)}
                className={adminInputClassName(Boolean(errors.title))}
                {...register("title")}
              />
            </AdminFormField>

            <AdminFormField
              label="URL"
              htmlFor="free-material-link-url"
              error={errors.url?.message}
              required
            >
              <Input
                id="free-material-link-url"
                type="url"
                placeholder="https://..."
                aria-invalid={Boolean(errors.url)}
                className={adminInputClassName(Boolean(errors.url))}
                {...register("url")}
              />
            </AdminFormField>

            <AdminFormField
              label="Krótki opis"
              htmlFor="free-material-link-description"
              error={errors.description?.message}
              required
            >
              <Textarea
                id="free-material-link-description"
                rows={3}
                placeholder="Co jest na tej stronie / do czego służy?"
                aria-invalid={Boolean(errors.description)}
                className={adminTextareaClassName(Boolean(errors.description))}
                {...register("description")}
              />
            </AdminFormField>

            <Controller
              name="published"
              control={control}
              render={({ field }) => (
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                    className="size-4 accent-[#f24a00] dark:accent-[#daff02]"
                  />
                  Opublikowany na stronie
                </label>
              )}
            />

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={isPending}
                className="h-10 bg-[#f24a00] px-5 text-white hover:bg-[#d94200] dark:bg-[#daff02] dark:text-black dark:hover:bg-[#9bec00]"
              >
                {editingId ? "Zapisz zmiany" : "Dodaj link"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={closeForm}
              >
                Anuluj
              </Button>
            </div>
          </form>

          <div className="mt-4 space-y-3">
            <AdminMessage error={error} />
          </div>
        </AdminPanelCard>
      ) : null}

      <AdminPanelCard>
        <h2 className="text-lg font-black tracking-[0.02em]">Lista linków</h2>

        {!showForm ? <AdminMessage error={error} /> : null}

        {isLoading ? (
          <AdminLoading label="Wczytywanie linków..." />
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">Brak linków.</p>
        ) : (
          <ul className="mt-6 divide-y divide-[#ddd8ce] dark:divide-zinc-800">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-black text-zinc-950 dark:text-white">
                      {item.title}
                    </h3>
                    {!item.published ? (
                      <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-[11px] font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                        Szkic
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex max-w-full items-center gap-1 truncate text-xs text-[#0033ff] underline-offset-2 hover:underline dark:text-[#daff02]"
                  >
                    <ExternalLinkIcon className="size-3.5 shrink-0" />
                    <span className="truncate">{item.url}</span>
                  </a>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => startEdit(item)}
                  >
                    <PencilIcon />
                    Edytuj
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => setItemToDelete(item)}
                  >
                    <Trash2Icon />
                    Usuń
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminPanelCard>

      <AdminConfirmDialog
        open={itemToDelete != null}
        onOpenChange={(open) => {
          if (!open && !isPending) setItemToDelete(null);
        }}
        title="Usunąć link?"
        description={
          itemToDelete
            ? `Czy na pewno chcesz usunąć link „${itemToDelete.title}"?`
            : ""
        }
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
