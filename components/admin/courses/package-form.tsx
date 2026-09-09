"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import {
  createPackage,
  listCoursesForPackage,
  updatePackage,
} from "@/app/admin/actions/packages";
import { AdminLoading } from "@/components/admin/admin-loading";
import { AdminMessage } from "@/components/admin/blog/blog-admin.shared";
import {
  AdminFormField,
  adminFileClassName,
  adminInputClassName,
  adminTextareaClassName,
} from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/blog/slug";
import { COURSE_KIND_LABELS } from "@/lib/courses/kinds";
import {
  COURSE_COVERS_BUCKET,
  IMAGE_UPLOAD_HINT,
  validateImageFile,
} from "@/lib/courses/storage";
import type { Course, CourseOption } from "@/lib/courses/types";
import { uploadImageToStorage } from "@/lib/supabase/upload-image.client";
import {
  packageSchema,
  type PackageFormValues,
} from "@/lib/validation/admin-packages.schemas";

type PackageFormProps = {
  coursePackage?: Course | null;
  onSaved: (coursePackage: Course) => void;
  onCancel: () => void;
};

const emptyForm: PackageFormValues = {
  title: "",
  slug: "",
  cover_image_url: null,
  description: "",
  description_secondary: "",
  price: 0,
  discount_price: null,
  published: false,
  course_ids: [],
};

export function PackageForm({
  coursePackage,
  onSaved,
  onCancel,
}: PackageFormProps) {
  const [slugEdited, setSlugEdited] = useState(() => Boolean(coursePackage));
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
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
  } = useForm<PackageFormValues>({
    resolver: yupResolver(packageSchema),
    defaultValues: emptyForm,
  });

  const coverImageUrl = watch("cover_image_url");
  const courseIds = watch("course_ids");

  useEffect(() => {
    setIsLoadingOptions(true);
    void listCoursesForPackage()
      .then((result) => {
        if (result.ok && result.data) setCourseOptions(result.data);
      })
      .finally(() => setIsLoadingOptions(false));
  }, []);

  useEffect(() => {
    if (!coursePackage) {
      reset(emptyForm);
      setSlugEdited(false);
      setCoverFile(null);
      setCoverError(null);
      return;
    }

    reset({
      title: coursePackage.title,
      slug: coursePackage.slug,
      cover_image_url: coursePackage.cover_image_url,
      description: coursePackage.description,
      description_secondary: coursePackage.description_secondary,
      price: coursePackage.price,
      discount_price: coursePackage.discount_price,
      published: coursePackage.published,
      course_ids: coursePackage.package_items.map((item) => item.id),
    });
    setSlugEdited(true);
    setCoverFile(null);
    setCoverError(null);
  }, [coursePackage, reset]);

  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    if (coverFile) {
      const objectUrl = URL.createObjectURL(coverFile);
      setCoverPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setCoverPreview(coverImageUrl);
  }, [coverFile, coverImageUrl]);

  function toggleCourse(courseId: string) {
    const next = courseIds.includes(courseId)
      ? courseIds.filter((id) => id !== courseId)
      : [...courseIds, courseId];
    setValue("course_ids", next, { shouldValidate: true });
  }

  const onSubmit = handleSubmit((values) => {
    setError(null);
    setCoverError(null);

    startTransition(async () => {
      let coverUrl = values.cover_image_url;

      if (coverFile) {
        const uploadResult = await uploadImageToStorage(
          COURSE_COVERS_BUCKET,
          coverFile,
        );

        if (!uploadResult.ok) {
          setCoverError(uploadResult.error);
          return;
        }

        coverUrl = uploadResult.url;
      }

      const payload = { ...values, cover_image_url: coverUrl };
      const result = coursePackage
        ? await updatePackage(coursePackage.id, payload)
        : await createPackage(payload);

      if (!result.ok) {
        setError(result.error ?? "Nie udało się zapisać pakietu.");
        return;
      }

      onSaved(result.data);
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <section className="space-y-5">
        <h3 className="text-sm font-black tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">
          Podstawowe
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <AdminFormField
            label="Nazwa pakietu"
            htmlFor="package-title"
            error={errors.title?.message}
            required
          >
            <Input
              id="package-title"
              placeholder="np. Pakiet: AI od podstaw"
              aria-invalid={Boolean(errors.title)}
              className={adminInputClassName(Boolean(errors.title))}
              {...register("title", {
                onChange: (event) => {
                  if (!slugEdited) {
                    setValue("slug", slugify(event.target.value), {
                      shouldValidate: true,
                    });
                  }
                },
              })}
            />
          </AdminFormField>

          <AdminFormField
            label="Slug (URL)"
            htmlFor="package-slug"
            error={errors.slug?.message}
            required
          >
            <Input
              id="package-slug"
              placeholder="pakiet-ai-od-podstaw"
              aria-invalid={Boolean(errors.slug)}
              className={adminInputClassName(Boolean(errors.slug))}
              {...register("slug", {
                onChange: () => setSlugEdited(true),
              })}
            />
          </AdminFormField>
        </div>

        <AdminFormField
          label="Zdjęcie okładki"
          htmlFor="package-cover"
          error={coverError ?? undefined}
          hint={IMAGE_UPLOAD_HINT}
        >
          <Input
            id="package-cover"
            type="file"
            accept="image/*"
            className={adminFileClassName(Boolean(coverError))}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                setCoverFile(null);
                setCoverError(null);
                return;
              }

              const validation = validateImageFile(file);
              if (!validation.ok) {
                setCoverFile(null);
                setCoverError(validation.error);
                return;
              }

              setCoverFile(file);
              setCoverError(null);
            }}
          />
        </AdminFormField>

        {coverPreview ? (
          <div className="relative aspect-[16/10] max-w-sm overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <Image
              src={coverPreview}
              alt="Podgląd okładki pakietu"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : null}
      </section>

      <section className="space-y-5">
        <h3 className="text-sm font-black tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">
          Ceny
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <AdminFormField
            label="Cena (PLN)"
            htmlFor="package-price"
            error={errors.price?.message}
            required
          >
            <Input
              id="package-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="199.00"
              aria-invalid={Boolean(errors.price)}
              className={adminInputClassName(Boolean(errors.price))}
              {...register("price", { valueAsNumber: true })}
            />
          </AdminFormField>

          <AdminFormField
            label="Cena po rabacie (PLN)"
            htmlFor="package-discount-price"
            error={errors.discount_price?.message}
            hint="Opcjonalnie - najniższa cena z 30 dni wyliczy się automatycznie"
          >
            <Input
              id="package-discount-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="149.00"
              aria-invalid={Boolean(errors.discount_price)}
              className={adminInputClassName(Boolean(errors.discount_price))}
              {...register("discount_price", {
                setValueAs: (value) =>
                  value === "" || value == null ? null : Number(value),
              })}
            />
          </AdminFormField>
        </div>
      </section>

      <section className="space-y-5">
        <h3 className="text-sm font-black tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">
          Opisy
        </h3>

        <AdminFormField
          label="Opis 1"
          htmlFor="package-description"
          error={errors.description?.message}
          required
        >
          <Textarea
            id="package-description"
            rows={6}
            placeholder="Główny opis pakietu..."
            aria-invalid={Boolean(errors.description)}
            className={adminTextareaClassName(Boolean(errors.description))}
            {...register("description")}
          />
        </AdminFormField>

        <AdminFormField
          label="Opis 2"
          htmlFor="package-description-secondary"
          error={errors.description_secondary?.message}
          hint="Opcjonalnie"
        >
          <Textarea
            id="package-description-secondary"
            rows={6}
            placeholder="Dodatkowy opis pakietu..."
            aria-invalid={Boolean(errors.description_secondary)}
            className={adminTextareaClassName(
              Boolean(errors.description_secondary),
            )}
            {...register("description_secondary")}
          />
        </AdminFormField>
      </section>

      <section className="space-y-5">
        <h3 className="text-sm font-black tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">
          Kursy w pakiecie
        </h3>

        <AdminFormField
          label="Wybierz kursy wchodzące w skład pakietu"
          htmlFor="package-courses"
          error={errors.course_ids?.message}
          required
        >
          {isLoadingOptions ? (
            <AdminLoading label="Wczytywanie kursów..." />
          ) : courseOptions.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Najpierw dodaj szkolenia lub szkolenia wideo.
            </p>
          ) : (
            <div id="package-courses" className="flex flex-wrap gap-2">
              {courseOptions.map((option) => {
                const checked = courseIds.includes(option.id);
                return (
                  <label
                    key={option.id}
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      checked
                        ? "border-[#f24a00] bg-[#ffd0bc] dark:border-[#daff02] dark:bg-[#3a4500]"
                        : "border-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCourse(option.id)}
                      className="size-4 accent-[#f24a00] dark:accent-[#daff02]"
                    />
                    {option.title}
                    <span className="text-[11px] font-bold tracking-wide text-zinc-500 uppercase">
                      {COURSE_KIND_LABELS[option.kind]}
                    </span>
                    {!option.published ? (
                      <span className="text-[11px] font-bold tracking-wide text-amber-600 uppercase dark:text-amber-400">
                        szkic
                      </span>
                    ) : null}
                  </label>
                );
              })}
            </div>
          )}
        </AdminFormField>
      </section>

      <Controller
        name="published"
        control={control}
        render={({ field }) => (
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            <input
              type="checkbox"
              checked={field.value}
              onChange={(event) => field.onChange(event.target.checked)}
              className="size-4 cursor-pointer rounded border-zinc-300 accent-[#f24a00] dark:border-zinc-600 dark:accent-[#daff02]"
            />
            Opublikowany na stronie publicznej
          </label>
        )}
      />

      {error ? <AdminMessage error={error} /> : null}

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 bg-[#f24a00] px-6 text-white hover:bg-[#d94200] dark:bg-[#daff02] dark:text-black dark:hover:bg-[#9bec00]"
        >
          {isPending
            ? "Zapisywanie..."
            : coursePackage
              ? "Zapisz zmiany"
              : "Dodaj pakiet"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isPending}
          className="h-11 rounded-xl"
        >
          Anuluj
        </Button>
      </div>
    </form>
  );
}
