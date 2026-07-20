"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, useTransition } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  createAuthor,
  deleteAuthor,
  listAuthors,
  updateAuthor,
} from "@/app/admin/actions/blog";
import {
  AdminFormField,
  adminFileClassName,
  adminInputClassName,
  adminTextareaClassName,
} from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  authorSchema,
  type AuthorFormValues,
} from "@/lib/validation/admin-blog.schemas";
import { AUTHOR_PHOTOS_BUCKET, IMAGE_UPLOAD_HINT, validateImageFile } from "@/lib/blog/storage";
import type { Author } from "@/lib/blog/types";
import { uploadImageToStorage } from "@/lib/supabase/upload-image.client";
import { scrollAdminPanelToTop } from "@/components/admin/admin.utils";

import { AdminLoading } from "@/components/admin/admin-loading";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminMessage, AdminPanelCard } from "./blog-admin.shared";

const emptyForm: AuthorFormValues = {
  first_name: "",
  last_name: "",
  position: "",
  description: "",
  photo_url: null,
};

export function BlogAuthorsManager() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AuthorFormValues>({
    resolver: yupResolver(authorSchema),
    defaultValues: emptyForm,
  });

  const photoUrl = watch("photo_url");

  const loadAuthors = useCallback(async () => {
    setIsLoading(true);
    const result = await listAuthors();
    if (result.ok) {
      setAuthors(result.data);
    } else {
      setError(result.error ?? "Nie udało się wczytać autorów.");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadAuthors();
  }, [loadAuthors]);

  useEffect(() => {
    if (photoFile) {
      const objectUrl = URL.createObjectURL(photoFile);
      setPhotoPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setPhotoPreview(photoUrl);
  }, [photoFile, photoUrl]);

  function resetFormState() {
    reset(emptyForm);
    setPhotoFile(null);
    setPhotoError(null);
    setEditingId(null);
  }

  function startEdit(author: Author) {
    setEditingId(author.id);
    reset({
      first_name: author.first_name,
      last_name: author.last_name,
      position: author.position,
      description: author.description,
      photo_url: author.photo_url,
    });
    setPhotoFile(null);
    setPhotoError(null);
    setError(null);
    scrollAdminPanelToTop();
  }

  const onSubmit = handleSubmit((values) => {
    setError(null);
    setPhotoError(null);

    if (!photoFile && !values.photo_url) {
      setPhotoError("Zdjęcie jest wymagane.");
      return;
    }

    startTransition(async () => {
      let nextPhotoUrl = values.photo_url;

      if (photoFile) {
        const uploadResult = await uploadImageToStorage(
          AUTHOR_PHOTOS_BUCKET,
          photoFile,
        );

        if (!uploadResult.ok) {
          setPhotoError(uploadResult.error);
          return;
        }

        nextPhotoUrl = uploadResult.url;
      }

      const payload = { ...values, photo_url: nextPhotoUrl };
      const result = editingId
        ? await updateAuthor(editingId, payload)
        : await createAuthor(payload);

      if (!result.ok) {
        setError(result.error ?? "Operacja nie powiodła się.");
        return;
      }

      toast.success(editingId ? "Autor zaktualizowany." : "Autor dodany.");
      resetFormState();
      await loadAuthors();
    });
  });

  function requestDelete(author: Author) {
    setAuthorToDelete(author);
  }

  function confirmDelete() {
    if (!authorToDelete) return;

    const id = authorToDelete.id;
    setError(null);

    startTransition(async () => {
      const result = await deleteAuthor(id);
      if (!result.ok) {
        setError(result.error ?? "Nie udało się usunąć autora.");
        return;
      }

      setAuthorToDelete(null);
      if (editingId === id) resetFormState();
      toast.success("Autor usunięty.");
      await loadAuthors();
    });
  }

  return (
    <div className="space-y-6">
      <AdminPanelCard>
        <h2 className="text-lg font-black tracking-[-0.02em]">
          {editingId ? "Edytuj autora" : "Nowy autor"}
        </h2>

        <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
          <div className="grid gap-5 md:grid-cols-2">
            <AdminFormField
              label="Imię"
              htmlFor="author-first-name"
              error={errors.first_name?.message}
              required
            >
              <Input
                id="author-first-name"
                aria-invalid={Boolean(errors.first_name)}
                className={adminInputClassName(Boolean(errors.first_name))}
                {...register("first_name")}
              />
            </AdminFormField>

            <AdminFormField
              label="Nazwisko"
              htmlFor="author-last-name"
              error={errors.last_name?.message}
              required
            >
              <Input
                id="author-last-name"
                aria-invalid={Boolean(errors.last_name)}
                className={adminInputClassName(Boolean(errors.last_name))}
                {...register("last_name")}
              />
            </AdminFormField>
          </div>

          <AdminFormField
            label="Stanowisko"
            htmlFor="author-position"
            error={errors.position?.message}
            required
          >
            <Input
              id="author-position"
              aria-invalid={Boolean(errors.position)}
              className={adminInputClassName(Boolean(errors.position))}
              {...register("position")}
            />
          </AdminFormField>

          <AdminFormField
            label="Opis"
            htmlFor="author-description"
            error={errors.description?.message}
            required
          >
            <Textarea
              id="author-description"
              rows={4}
              aria-invalid={Boolean(errors.description)}
              className={adminTextareaClassName(Boolean(errors.description))}
              {...register("description")}
            />
          </AdminFormField>

          <AdminFormField
            label="Zdjęcie"
            htmlFor="author-photo"
            error={photoError ?? undefined}
            hint={IMAGE_UPLOAD_HINT}
            required
          >
            <Input
              id="author-photo"
              type="file"
              accept="image/*"
              aria-invalid={Boolean(photoError)}
              className={adminFileClassName(Boolean(photoError))}
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setPhotoError(null);

                if (!file) {
                  setPhotoFile(null);
                  return;
                }

                const validation = validateImageFile(file);
                if (!validation.ok) {
                  event.target.value = "";
                  setPhotoFile(null);
                  setPhotoError(validation.error);
                  return;
                }

                setPhotoFile(file);
              }}
            />
            {photoPreview ? (
              <div className="relative mt-3 size-24 overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-700">
                <Image
                  src={photoPreview}
                  alt="Podgląd zdjęcia autora"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : null}
          </AdminFormField>

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 bg-[#f24a00] px-5 text-white hover:bg-[#d94200] dark:bg-[#daff02] dark:text-black dark:hover:bg-[#9bec00]"
            >
              {editingId ? "Zapisz zmiany" : "Dodaj autora"}
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
        <h2 className="text-lg font-black tracking-[-0.02em]">Lista autorów</h2>

        {isLoading ? (
          <AdminLoading label="Wczytywanie autorów..." />
        ) : authors.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">Brak autorów.</p>
        ) : (
          <ul className="mt-6 divide-y divide-zinc-100 dark:divide-zinc-800">
            {authors.map((author) => (
              <li
                key={author.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="flex gap-4">
                  {author.photo_url ? (
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-700">
                      <Image
                        src={author.photo_url}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-500 dark:bg-zinc-800">
                      {author.first_name[0]}
                      {author.last_name[0]}
                    </div>
                  )}

                  <div>
                    <p className="font-bold text-zinc-950 dark:text-white">
                      {author.first_name} {author.last_name}
                    </p>
                    {author.position ? (
                      <p className="mt-1 text-sm text-[#0033ff]">{author.position}</p>
                    ) : null}
                    {author.description ? (
                      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                        {author.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => startEdit(author)}
                  >
                    <PencilIcon />
                    Edytuj
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={isPending}
                    onClick={() => requestDelete(author)}
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
        open={authorToDelete != null}
        onOpenChange={(open) => {
          if (!open && !isPending) setAuthorToDelete(null);
        }}
        title="Usunąć autora?"
        description={
          authorToDelete
            ? `Czy na pewno chcesz usunąć autora ${authorToDelete.first_name} ${authorToDelete.last_name}? Tej operacji nie można cofnąć.`
            : ""
        }
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
