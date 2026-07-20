"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useTransition } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { ImageIcon, Trash2Icon } from "lucide-react";

import {
  createTestimonial,
  updateTestimonial,
} from "@/app/admin/actions/testimonials";
import {
  AdminFormField,
  adminInputClassName,
  adminTextareaClassName,
} from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  IMAGE_UPLOAD_HINT,
  TESTIMONIAL_AVATARS_BUCKET,
  validateImageFile,
} from "@/lib/testimonials/storage";
import type { Testimonial } from "@/lib/testimonials/types";
import { uploadImageToStorage } from "@/lib/supabase/upload-image.client";
import {
  testimonialSchema,
  type TestimonialFormValues,
} from "@/lib/validation/admin-testimonials.schemas";

import { AdminMessage } from "@/components/admin/blog/blog-admin.shared";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type TestimonialFormProps = {
  item?: Testimonial | null;
  onSaved: (item: Testimonial) => void;
  onCancel: () => void;
};

const emptyForm: TestimonialFormValues = {
  author_name: "",
  author_role: "",
  content: "",
  rating: 5,
  avatar_url: null,
  published: true,
};

export function TestimonialForm({ item, onSaved, onCancel }: TestimonialFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<TestimonialFormValues>({
    resolver: yupResolver(testimonialSchema),
    defaultValues: emptyForm,
  });

  const avatarUrl = watch("avatar_url");
  const authorName = watch("author_name");

  useEffect(() => {
    if (!item) {
      reset(emptyForm);
      setAvatarFile(null);
      setAvatarError(null);
      return;
    }

    reset({
      author_name: item.author_name,
      author_role: item.author_role,
      content: item.content,
      rating: item.rating,
      avatar_url: item.avatar_url,
      published: item.published,
    });
    setAvatarFile(null);
    setAvatarError(null);
  }, [item, reset]);

  useEffect(() => {
    if (avatarFile) {
      const objectUrl = URL.createObjectURL(avatarFile);
      setAvatarPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setAvatarPreview(avatarUrl);
  }, [avatarFile, avatarUrl]);

  const onSubmit = handleSubmit((values) => {
    setError(null);
    setAvatarError(null);

    startTransition(async () => {
      let nextAvatarUrl = values.avatar_url;

      if (avatarFile) {
        const uploadResult = await uploadImageToStorage(
          TESTIMONIAL_AVATARS_BUCKET,
          avatarFile,
        );

        if (!uploadResult.ok) {
          setAvatarError(uploadResult.error);
          return;
        }

        nextAvatarUrl = uploadResult.url;
      }

      const payload = { ...values, avatar_url: nextAvatarUrl };
      const result = item
        ? await updateTestimonial(item.id, payload)
        : await createTestimonial(payload);

      if (!result.ok) {
        setError(result.error ?? "Operacja nie powiodła się.");
        return;
      }

      onSaved(result.data);
    });
  });

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setAvatarError(null);

    if (!file) {
      setAvatarFile(null);
      return;
    }

    const validation = validateImageFile(file);
    if (!validation.ok) {
      event.target.value = "";
      setAvatarFile(null);
      setAvatarError(validation.error);
      return;
    }

    setAvatarFile(file);
  }

  function removeAvatar() {
    setAvatarFile(null);
    setAvatarError(null);
    setValue("avatar_url", null, { shouldDirty: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const hasAvatar = Boolean(avatarPreview);

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <AdminFormField
          label="Imię i nazwisko"
          htmlFor="testimonial-author-name"
          error={errors.author_name?.message}
          required
        >
          <Input
            id="testimonial-author-name"
            placeholder="np. Anna Kowalska"
            aria-invalid={Boolean(errors.author_name)}
            className={adminInputClassName(Boolean(errors.author_name))}
            {...register("author_name")}
          />
        </AdminFormField>

        <AdminFormField
          label="Rola / zawód"
          htmlFor="testimonial-author-role"
          error={errors.author_role?.message}
          required
        >
          <Input
            id="testimonial-author-role"
            placeholder="np. Nauczycielka"
            aria-invalid={Boolean(errors.author_role)}
            className={adminInputClassName(Boolean(errors.author_role))}
            {...register("author_role")}
          />
        </AdminFormField>
      </div>

      <AdminFormField
        label="Treść opinii"
        htmlFor="testimonial-content"
        error={errors.content?.message}
        required
      >
        <Textarea
          id="testimonial-content"
          rows={5}
          placeholder="Co napisał użytkownik o kursie..."
          aria-invalid={Boolean(errors.content)}
          className={adminTextareaClassName(Boolean(errors.content))}
          {...register("content")}
        />
      </AdminFormField>

      <AdminFormField
        label="Ocena (1–5)"
        htmlFor="testimonial-rating"
        error={errors.rating?.message}
        required
      >
        <Input
          id="testimonial-rating"
          type="number"
          min="1"
          max="5"
          step="1"
          aria-invalid={Boolean(errors.rating)}
          className={adminInputClassName(Boolean(errors.rating))}
          {...register("rating", { valueAsNumber: true })}
        />
      </AdminFormField>

      <AdminFormField
        label="Zdjęcie autora"
        htmlFor="testimonial-avatar"
        error={avatarError ?? undefined}
        hint={`Opcjonalnie. ${IMAGE_UPLOAD_HINT} Bez zdjęcia na stronie pokażemy inicjały.`}
      >
        <div className="flex flex-wrap items-center gap-5">
          {hasAvatar ? (
            <div className="relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-[#f24a00] dark:border-[#daff02]">
              <Image
                src={avatarPreview!}
                alt="Podgląd zdjęcia autora"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex size-20 shrink-0 items-center justify-center rounded-full border-2 border-[#f24a00]/30 bg-[#ffd0bc] text-sm font-black text-[#f24a00] dark:border-[#daff02]/40 dark:bg-[#3a4500] dark:text-[#daff02]">
              {getInitials(authorName) || "?"}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              id="testimonial-avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />

            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="size-4" />
              {hasAvatar ? "Zmień zdjęcie" : "Dodaj zdjęcie"}
            </Button>

            {hasAvatar ? (
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl"
                onClick={removeAvatar}
              >
                <Trash2Icon className="size-4" />
                Usuń zdjęcie
              </Button>
            ) : null}
          </div>
        </div>
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
            Opublikowana na stronie głównej
          </label>
        )}
      />

      <AdminMessage error={error} />

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 bg-[#f24a00] px-5 text-white hover:bg-[#d94200] dark:bg-[#daff02] dark:text-black dark:hover:bg-[#9bec00]"
        >
          {item ? "Zapisz opinię" : "Dodaj opinię"}
        </Button>
        <Button type="button" variant="outline" disabled={isPending} onClick={onCancel}>
          Anuluj
        </Button>
      </div>
    </form>
  );
}
