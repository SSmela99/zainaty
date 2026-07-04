"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import {
  createBlogPost,
  listAuthors,
  listBlogPostOptions,
  listTags,
  updateBlogPost,
} from "@/app/admin/actions/blog";
import {
  AdminFormField,
  AdminSelect,
  adminFileClassName,
  adminInputClassName,
  adminTextareaClassName,
} from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/blog/slug";
import { BLOG_COVERS_BUCKET, IMAGE_UPLOAD_HINT, validateImageFile } from "@/lib/blog/storage";
import {
  blogPostSchema,
  type BlogPostFormValues,
} from "@/lib/validation/admin-blog.schemas";
import type { Author, BlogPostRef, BlogPostWithRelations, Tag } from "@/lib/blog/types";
import { uploadImageToStorage } from "@/lib/supabase/upload-image.client";

import { AdminLoading } from "@/components/admin/admin-loading";
import { AdminMessage } from "./blog-admin.shared";
import { BlogContentEditor } from "./blog-content-editor";

type BlogPostFormProps = {
  post?: BlogPostWithRelations | null;
  onSaved: (post: BlogPostWithRelations) => void;
  onCancel: () => void;
};

const emptyForm: BlogPostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content_html: "",
  cover_image_url: null,
  author_id: null,
  tag_ids: [],
  related_post_ids: [],
  reading_time_minutes: 5,
  published: false,
};

export function BlogPostForm({ post, onSaved, onCancel }: BlogPostFormProps) {
  const [slugEdited, setSlugEdited] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [postOptions, setPostOptions] = useState<BlogPostRef[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<BlogPostFormValues>({
    resolver: yupResolver(blogPostSchema),
    defaultValues: emptyForm,
  });

  const coverImageUrl = watch("cover_image_url");
  const tagIds = watch("tag_ids");
  const relatedPostIds = watch("related_post_ids");

  useEffect(() => {
    setIsLoadingOptions(true);
    void Promise.all([listAuthors(), listTags(), listBlogPostOptions()])
      .then(([authorsResult, tagsResult, postsResult]) => {
        if (authorsResult.ok && authorsResult.data) setAuthors(authorsResult.data);
        if (tagsResult.ok && tagsResult.data) setTags(tagsResult.data);
        if (postsResult.ok && postsResult.data) setPostOptions(postsResult.data);
      })
      .finally(() => setIsLoadingOptions(false));
  }, []);

  useEffect(() => {
    if (!post) {
      reset(emptyForm);
      setSlugEdited(false);
      setCoverFile(null);
      setCoverError(null);
      return;
    }

    reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content_html: post.content_html,
      cover_image_url: post.cover_image_url,
      author_id: post.author_id,
      tag_ids: post.tags.map((tag) => tag.id),
      related_post_ids: post.related_posts.map((related) => related.id),
      reading_time_minutes: post.reading_time_minutes,
      published: post.published,
    });
    setSlugEdited(true);
    setCoverFile(null);
    setCoverError(null);
  }, [post, reset]);

  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    if (coverFile) {
      const objectUrl = URL.createObjectURL(coverFile);
      setCoverPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setCoverPreview(coverImageUrl);
  }, [coverFile, coverImageUrl]);

  function toggleTag(tagId: string) {
    const next = tagIds.includes(tagId)
      ? tagIds.filter((id) => id !== tagId)
      : [...tagIds, tagId];
    setValue("tag_ids", next, { shouldValidate: true });
  }

  function toggleRelatedPost(relatedPostId: string) {
    const next = relatedPostIds.includes(relatedPostId)
      ? relatedPostIds.filter((id) => id !== relatedPostId)
      : [...relatedPostIds, relatedPostId];
    setValue("related_post_ids", next, { shouldValidate: true });
  }

  const selectablePosts = postOptions.filter((option) => option.id !== post?.id);

  const onSubmit = handleSubmit((values) => {
    setError(null);
    setCoverError(null);

    startTransition(async () => {
      let coverUrl = values.cover_image_url;

      if (coverFile) {
        const uploadResult = await uploadImageToStorage(
          BLOG_COVERS_BUCKET,
          coverFile,
        );

        if (!uploadResult.ok) {
          setCoverError(uploadResult.error);
          return;
        }

        coverUrl = uploadResult.url;
      }

      const payload = { ...values, cover_image_url: coverUrl };
      const result = post
        ? await updateBlogPost(post.id, payload)
        : await createBlogPost(payload);

      if (!result.ok) {
        setError(result.error ?? "Nie udało się zapisać artykułu.");
        return;
      }

      onSaved(result.data);
    });
  });

  if (isLoadingOptions) {
    return <AdminLoading label="Wczytywanie formularza..." />;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <AdminFormField
          label="Tytuł"
          htmlFor="post-title"
          error={errors.title?.message}
          required
        >
          <Input
            id="post-title"
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
          htmlFor="post-slug"
          error={errors.slug?.message}
          required
        >
          <Input
            id="post-slug"
            aria-invalid={Boolean(errors.slug)}
            className={adminInputClassName(Boolean(errors.slug))}
            {...register("slug", {
              onChange: () => setSlugEdited(true),
            })}
          />
        </AdminFormField>
      </div>

      <AdminFormField
        label="Czas czytania (min)"
        htmlFor="post-reading-time"
        error={errors.reading_time_minutes?.message}
        hint="Szacunkowy czas czytania artykułu"
        required
      >
        <Input
          id="post-reading-time"
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          aria-invalid={Boolean(errors.reading_time_minutes)}
          className={adminInputClassName(
            Boolean(errors.reading_time_minutes),
            "max-w-40",
          )}
          {...register("reading_time_minutes", { valueAsNumber: true })}
        />
      </AdminFormField>

      <AdminFormField
        label="Krótki opis"
        htmlFor="post-excerpt"
        error={errors.excerpt?.message}
        required
      >
        <Textarea
          id="post-excerpt"
          rows={2}
          aria-invalid={Boolean(errors.excerpt)}
          className={adminTextareaClassName(Boolean(errors.excerpt))}
          {...register("excerpt")}
        />
      </AdminFormField>

      <AdminFormField
        label="Treść (HTML)"
        htmlFor="post-content"
        error={errors.content_html?.message}
        required
      >
        <Controller
          name="content_html"
          control={control}
          render={({ field }) => (
            <BlogContentEditor
              value={field.value}
              onChange={field.onChange}
              error={errors.content_html?.message}
              textareaClassName={adminTextareaClassName(
                Boolean(errors.content_html),
                "font-mono text-[13px]",
              )}
            />
          )}
        />
      </AdminFormField>

      <AdminFormField
        label="Główne zdjęcie"
        htmlFor="post-cover"
        error={coverError ?? errors.cover_image_url?.message}
        hint={IMAGE_UPLOAD_HINT}
        required
      >
        <Input
          id="post-cover"
          type="file"
          accept="image/*"
          aria-invalid={Boolean(coverError ?? errors.cover_image_url)}
          className={adminFileClassName(Boolean(coverError ?? errors.cover_image_url))}
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            setCoverError(null);

            if (!file) {
              setCoverFile(null);
              setValue("cover_image_url", post?.cover_image_url ?? null, {
                shouldValidate: true,
              });
              return;
            }

            const validation = validateImageFile(file);
            if (!validation.ok) {
              event.target.value = "";
              setCoverFile(null);
              setCoverError(validation.error);
              setValue("cover_image_url", post?.cover_image_url ?? null, {
                shouldValidate: true,
              });
              return;
            }

            setCoverFile(file);
            setValue("cover_image_url", coverImageUrl || "pending", {
              shouldValidate: true,
            });
          }}
        />
        {coverPreview ? (
          <div className="relative mt-3 aspect-[16/9] max-w-md overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
            <Image
              src={coverPreview}
              alt="Podgląd okładki"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : null}
      </AdminFormField>

      <AdminFormField
        label="Autor"
        htmlFor="post-author"
        error={errors.author_id?.message}
        required
      >
        <Controller
          name="author_id"
          control={control}
          render={({ field }) => (
            <AdminSelect
              id="post-author"
              value={field.value ?? ""}
              onChange={(event) => field.onChange(event.target.value || null)}
              hasError={Boolean(errors.author_id)}
              aria-invalid={Boolean(errors.author_id)}
            >
              <option value="">— wybierz autora —</option>
              {authors.map((author) => (
                <option key={author.id} value={author.id}>
                  {author.first_name} {author.last_name}
                  {author.position ? ` · ${author.position}` : ""}
                </option>
              ))}
            </AdminSelect>
          )}
        />
      </AdminFormField>

      <AdminFormField
        label="Tagi"
        htmlFor="post-tags"
        error={errors.tag_ids?.message}
        required
      >
        {tags.length === 0 ? (
          <p className="text-sm text-zinc-500">Najpierw dodaj tagi w zakładce Tagi.</p>
        ) : (
          <div id="post-tags" className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const checked = tagIds.includes(tag.id);
              return (
                <label
                  key={tag.id}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    checked
                      ? "border-[#ff4b12] bg-[#ffe1cc] dark:border-[#d7ff00] dark:bg-[#3a3d10]"
                      : "border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleTag(tag.id)}
                    className="size-4 accent-[#ff4b12] dark:accent-[#d7ff00]"
                  />
                  {tag.name}
                </label>
              );
            })}
          </div>
        )}
      </AdminFormField>

      <AdminFormField label="Powiązane artykuły" htmlFor="post-related">
        {selectablePosts.length === 0 ? (
          <p className="text-sm text-zinc-500">
            {postOptions.length === 0
              ? "Najpierw dodaj inne artykuły."
              : "Brak innych artykułów do powiązania."}
          </p>
        ) : (
          <div id="post-related" className="flex flex-wrap gap-2">
            {selectablePosts.map((relatedPost) => {
              const checked = relatedPostIds.includes(relatedPost.id);
              return (
                <label
                  key={relatedPost.id}
                  className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    checked
                      ? "border-[#1a4dff] bg-[#dfe5ff] dark:border-[#7d9bff] dark:bg-[#1a2a5e]"
                      : "border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRelatedPost(relatedPost.id)}
                    className="size-4 accent-[#1a4dff] dark:accent-[#7d9bff]"
                  />
                  {relatedPost.title}
                  {!relatedPost.published ? (
                    <span className="text-[11px] font-bold tracking-wide text-zinc-500 uppercase">
                      szkic
                    </span>
                  ) : null}
                </label>
              );
            })}
          </div>
        )}
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
              className="size-4 accent-[#ff4b12] dark:accent-[#d7ff00]"
            />
            Opublikowany
          </label>
        )}
      />

      <AdminMessage error={error} />

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 bg-[#ff4b12] px-5 text-white hover:bg-[#e6430f] dark:bg-[#d7ff00] dark:text-black dark:hover:bg-[#c4eb00]"
        >
          {post ? "Zapisz artykuł" : "Dodaj artykuł"}
        </Button>
        <Button type="button" variant="outline" disabled={isPending} onClick={onCancel}>
          Anuluj
        </Button>
      </div>
    </form>
  );
}
