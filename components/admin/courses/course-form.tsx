"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { createCourse, updateCourse } from "@/app/admin/actions/courses";
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
import {
  createDefaultCurriculum,
  curriculumFormValuesToInput,
  curriculumTreeToFormValues,
} from "@/lib/courses/curriculum";
import {
  COURSE_KIND_SINGULAR,
  getCourseFormatLabel,
  type CourseKind,
} from "@/lib/courses/kinds";
import {
  COURSE_COVERS_BUCKET,
  IMAGE_UPLOAD_HINT,
  validateImageFile,
} from "@/lib/courses/storage";
import type { Course } from "@/lib/courses/types";
import { uploadImageToStorage } from "@/lib/supabase/upload-image.client";
import {
  courseSchema,
  type CourseFormValues,
} from "@/lib/validation/admin-courses.schemas";

import { AdminMessage } from "@/components/admin/blog/blog-admin.shared";
import { CourseFilesList } from "./course-files-list";
import { CourseStringList } from "./course-string-list";
import {
  filesToCurriculumFallback,
  VideoCurriculumEditor,
} from "./video-curriculum-editor";

type CourseFormProps = {
  course?: Course | null;
  kind: CourseKind;
  onSaved: (course: Course) => void;
  onCancel: () => void;
};

function createEmptyForm(kind: CourseKind): CourseFormValues {
  return {
    kind,
    title: "",
    slug: "",
    description: "",
    demo_youtube_url: null,
    cover_image_url: null,
    price: 0,
    discount_price: null,
    target_audience: "",
    learning_points: [""],
    outcomes: [""],
    duration_label: "",
    format_label: getCourseFormatLabel(kind),
    published: false,
    is_featured: false,
    show_in_news: false,
    files:
      kind === "video"
        ? []
        : [
            {
              file_type: "pdf",
              title: "",
              r2_object_key: "",
            },
          ],
    curriculum: kind === "video" ? createDefaultCurriculum() : [],
  };
}

export function CourseForm({ course, kind, onSaved, onCancel }: CourseFormProps) {
  const [slugEdited, setSlugEdited] = useState(() => Boolean(course));
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
  } = useForm<CourseFormValues>({
    resolver: yupResolver(courseSchema),
    defaultValues: createEmptyForm(kind),
  });

  const coverImageUrl = watch("cover_image_url");
  const courseSlug = watch("slug");

  useEffect(() => {
    setValue("kind", kind);
  }, [kind, setValue]);

  useEffect(() => {
    if (!course) {
      reset(createEmptyForm(kind));
      setSlugEdited(false);
      setCoverFile(null);
      setCoverError(null);
      return;
    }

    reset({
      kind: course.kind,
      title: course.title,
      slug: course.slug,
      description: course.description,
      demo_youtube_url: course.demo_youtube_url,
      cover_image_url: course.cover_image_url,
      price: course.price,
      discount_price: course.discount_price,
      target_audience: course.target_audience,
      learning_points:
        course.learning_points.length > 0 ? course.learning_points : [""],
      outcomes: course.outcomes.length > 0 ? course.outcomes : [""],
      duration_label: course.duration_label,
      format_label: course.format_label,
      published: course.published,
      is_featured: course.is_featured,
      show_in_news: course.show_in_news,
      files:
        course.kind === "video"
          ? []
          : course.files.length > 0
            ? course.files.map((file) => ({
                file_type: file.file_type,
                title: file.title,
                r2_object_key: file.r2_object_key,
              }))
            : [
                {
                  file_type: "pdf" as const,
                  title: "",
                  r2_object_key: "",
                },
              ],
      curriculum:
        course.kind === "video"
          ? course.curriculum.length > 0
            ? curriculumTreeToFormValues(course.curriculum)
            : filesToCurriculumFallback(course.files)
          : [],
    });
    setSlugEdited(true);
    setCoverFile(null);
    setCoverError(null);
  }, [course, kind, reset]);

  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    if (coverFile) {
      const objectUrl = URL.createObjectURL(coverFile);
      setCoverPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setCoverPreview(coverImageUrl);
  }, [coverFile, coverImageUrl]);

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

      const payload = {
        ...values,
        kind,
        cover_image_url: coverUrl,
        curriculum: curriculumFormValuesToInput(values.curriculum),
        files: kind === "video" ? [] : values.files,
      };
      const result = course
        ? await updateCourse(course.id, payload)
        : await createCourse(payload);

      if (!result.ok) {
        setError(result.error ?? "Nie udało się zapisać kursu.");
        return;
      }

      onSaved(result.data);
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      <input type="hidden" {...register("kind")} />
      <section className="space-y-5">
        <h3 className="text-sm font-black tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">
          Podstawowe
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          <AdminFormField
            label="Nazwa kursu"
            htmlFor="course-title"
            error={errors.title?.message}
            required
          >
            <Input
              id="course-title"
              placeholder="np. AI bez tajemnic"
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
            htmlFor="course-slug"
            error={errors.slug?.message}
            required
          >
            <Input
              id="course-slug"
              placeholder="ai-bez-tajemnic"
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
          htmlFor="course-cover"
          error={coverError ?? undefined}
          hint={IMAGE_UPLOAD_HINT}
        >
          <Input
            id="course-cover"
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
              alt="Podgląd okładki kursu"
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
            htmlFor="course-price"
            error={errors.price?.message}
            required
          >
            <Input
              id="course-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="99.00"
              aria-invalid={Boolean(errors.price)}
              className={adminInputClassName(Boolean(errors.price))}
              {...register("price", { valueAsNumber: true })}
            />
          </AdminFormField>

          <AdminFormField
            label="Cena po rabacie (PLN)"
            htmlFor="course-discount-price"
            error={errors.discount_price?.message}
            hint="Opcjonalnie"
          >
            <Input
              id="course-discount-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="59.00"
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
          O kursie
        </h3>

        {kind !== "training" ? (
          <AdminFormField
            label="Link do demo na YouTube"
            htmlFor="course-demo-youtube"
            error={errors.demo_youtube_url?.message}
            hint="Opcjonalnie. Wyświetlane nad opisem kursu w sekcji „Zobacz demo”."
          >
            <Input
              id="course-demo-youtube"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              aria-invalid={Boolean(errors.demo_youtube_url)}
              className={adminInputClassName(Boolean(errors.demo_youtube_url))}
              {...register("demo_youtube_url")}
            />
          </AdminFormField>
        ) : null}

        <AdminFormField
          label="Opis"
          htmlFor="course-description"
          error={errors.description?.message}
          required
        >
          <Textarea
            id="course-description"
            rows={8}
            placeholder="Pełny opis kursu wyświetlany w sekcji „O kursie”..."
            aria-invalid={Boolean(errors.description)}
            className={adminTextareaClassName(Boolean(errors.description))}
            {...register("description")}
          />
        </AdminFormField>

        <div className="grid gap-5 md:grid-cols-2">
          <AdminFormField
            label="Ile czasu zajmuje"
            htmlFor="course-duration"
            error={errors.duration_label?.message}
            required
          >
            <Input
              id="course-duration"
              placeholder="np. 3-4 godziny czytania"
              aria-invalid={Boolean(errors.duration_label)}
              className={adminInputClassName(Boolean(errors.duration_label))}
              {...register("duration_label")}
            />
          </AdminFormField>

          <AdminFormField
            label="Format"
            htmlFor="course-format"
            error={errors.format_label?.message}
          >
            <Input
              id="course-format"
              placeholder="np. E-book"
              aria-invalid={Boolean(errors.format_label)}
              className={adminInputClassName(Boolean(errors.format_label))}
              {...register("format_label")}
            />
          </AdminFormField>
        </div>
      </section>

      <section className="space-y-5">
        <h3 className="text-sm font-black tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">
          Szczegóły
        </h3>

        <AdminFormField
          label="Dla kogo jest ten kurs"
          htmlFor="course-target-audience"
          error={errors.target_audience?.message}
          required
        >
          <Textarea
            id="course-target-audience"
            rows={3}
            placeholder="np. Dla osób, które chcą zrozumieć AI od podstaw"
            aria-invalid={Boolean(errors.target_audience)}
            className={adminTextareaClassName(Boolean(errors.target_audience))}
            {...register("target_audience")}
          />
        </AdminFormField>

        <Controller
          name="learning_points"
          control={control}
          render={({ field }) => (
            <CourseStringList
              label="Czego się nauczysz"
              description="Punkty wyświetlane z ikoną checkmarka."
              values={field.value}
              onChange={field.onChange}
              placeholder="np. Jak działa ChatGPT"
              error={errors.learning_points?.message}
            />
          )}
        />

        <Controller
          name="outcomes"
          control={control}
          render={({ field }) => (
            <CourseStringList
              label="Co będziesz umieć po ukończeniu"
              description="Punkty wyświetlane z ikoną gwiazdki."
              values={field.value}
              onChange={field.onChange}
              placeholder="np. Świadomie korzystać z narzędzi AI"
              error={errors.outcomes?.message}
            />
          )}
        />
      </section>

      <section className="space-y-5">
        <h3 className="text-sm font-black tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">
          {kind === "video" ? "Program kursu" : "Pliki do pobrania"}
        </h3>

        {kind === "video" ? (
          <Controller
            name="curriculum"
            control={control}
            render={({ field }) => (
              <VideoCurriculumEditor
                value={field.value}
                onChange={field.onChange}
                error={errors.curriculum?.message}
                courseSlug={courseSlug}
              />
            )}
          />
        ) : (
          <Controller
            name="files"
            control={control}
            render={({ field }) => (
              <CourseFilesList
                values={field.value}
                onChange={field.onChange}
                error={errors.files?.message}
                courseSlug={courseSlug}
                courseKind={kind}
              />
            )}
          />
        )}
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

      {kind === "training" || kind === "video" ? (
        <Controller
          name="is_featured"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(event) => field.onChange(event.target.checked)}
                  className="size-4 cursor-pointer rounded border-zinc-300 accent-[#f24a00] dark:border-zinc-600 dark:accent-[#daff02]"
                />
                Dodaj do polecanych
              </label>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Produkt pojawi się w sliderze „Polecane kursy” na stronie
                głównej.
              </p>
            </div>
          )}
        />
      ) : null}

      <Controller
        name="show_in_news"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
                className="size-4 cursor-pointer rounded border-zinc-300 accent-[#f24a00] dark:border-zinc-600 dark:accent-[#daff02]"
              />
              Dodaj do nowości
            </label>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Produkt pojawi się w sliderze „Nowości” na stronie głównej.
            </p>
          </div>
        )}
      />

      {error ? <AdminMessage error={error} /> : null}

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 bg-[#f24a00] px-6 text-white hover:bg-[#d94200] dark:bg-[#daff02] dark:text-black dark:hover:bg-[#9bec00]"
        >
          {isPending ? "Zapisywanie..." : course ? "Zapisz zmiany" : `Dodaj ${COURSE_KIND_SINGULAR[kind]}`}
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
