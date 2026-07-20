"use server";

import { revalidatePath, updateTag as updateCacheTag } from "next/cache";

import { slugify } from "@/lib/blog/slug";
import type {
  Author,
  AuthorInput,
  BlogActionResult,
  BlogPostInput,
  BlogPostRef,
  BlogPostWithRelations,
  Tag,
  TagInput,
} from "@/lib/blog/types";
import { requireAdmin } from "@/lib/auth/require-admin";
import { createClient } from "@/lib/supabase/server";

function mapPost(row: Record<string, unknown>): BlogPostWithRelations {
  const tagRows = (row.blog_post_tags as Array<{ tag: Tag | null }> | null) ?? [];
  const relatedRows =
    (row.blog_post_related as Array<{ related_post: BlogPostRef | null }> | null) ??
    [];

  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    excerpt: row.excerpt as string,
    content_html: row.content_html as string,
    cover_image_url: (row.cover_image_url as string | null) ?? null,
    author_id: (row.author_id as string | null) ?? null,
    published: row.published as boolean,
    published_at: (row.published_at as string | null) ?? null,
    is_featured: (row.is_featured as boolean | undefined) ?? false,
    show_in_news: (row.show_in_news as boolean | undefined) ?? false,
    reading_time_minutes: (row.reading_time_minutes as number | undefined) ?? 5,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    author: (row.author as Author | null) ?? null,
    tags: tagRows.flatMap((entry) => (entry.tag ? [entry.tag] : [])),
    related_posts: relatedRows.flatMap((entry) =>
      entry.related_post ? [entry.related_post] : [],
    ),
  };
}

const POST_SELECT = `
  *,
  author:authors(*),
  blog_post_tags(tag:tags(*)),
  blog_post_related!blog_post_related_post_id_fkey(
    related_post:blog_posts!blog_post_related_related_post_id_fkey(
      id,
      title,
      slug,
      published
    )
  )
`;

function revalidateBlogPublicPaths() {
  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath("/");
  updateCacheTag("home-blog");
  updateCacheTag("home-news");
}

// --- Autorzy ---

export async function listAuthors(): Promise<BlogActionResult<Author[]>> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("authors")
      .select("*")
      .order("last_name")
      .order("first_name");

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: data ?? [] };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function createAuthor(
  input: AuthorInput,
): Promise<BlogActionResult<Author>> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("authors")
      .insert(input)
      .select("*")
      .single();

    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin");
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function updateAuthor(
  id: string,
  input: AuthorInput,
): Promise<BlogActionResult<Author>> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("authors")
      .update(input)
      .eq("id", id)
      .select("*")
      .single();

    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin");
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function deleteAuthor(id: string): Promise<BlogActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("authors").delete().eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

// --- Tagi ---

export async function listTags(): Promise<BlogActionResult<Tag[]>> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .order("name");

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: data ?? [] };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function createTag(input: TagInput): Promise<BlogActionResult<Tag>> {
  try {
    const supabase = await requireAdmin();
    const slug = slugify(input.name);

    if (!slug) {
      return { ok: false, error: "Nieprawidłowa nazwa tagu." };
    }

    const { data, error } = await supabase
      .from("tags")
      .insert({ name: input.name.trim(), slug })
      .select("*")
      .single();

    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin");
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function updateTag(
  id: string,
  input: TagInput,
): Promise<BlogActionResult<Tag>> {
  try {
    const supabase = await requireAdmin();
    const slug = slugify(input.name);

    if (!slug) {
      return { ok: false, error: "Nieprawidłowa nazwa tagu." };
    }

    const { data, error } = await supabase
      .from("tags")
      .update({ name: input.name.trim(), slug })
      .eq("id", id)
      .select("*")
      .single();

    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin");
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function deleteTag(id: string): Promise<BlogActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("tags").delete().eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

// --- Artykuły ---

export async function listBlogPosts(): Promise<
  BlogActionResult<BlogPostWithRelations[]>
> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .order("created_at", { ascending: false });

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []).map(mapPost) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function getBlogPost(
  id: string,
): Promise<BlogActionResult<BlogPostWithRelations>> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .eq("id", id)
      .single();

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: mapPost(data) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

async function syncPostTags(
  supabase: Awaited<ReturnType<typeof createClient>>,
  postId: string,
  tagIds: string[],
) {
  await supabase.from("blog_post_tags").delete().eq("post_id", postId);

  if (tagIds.length === 0) return;

  const { error } = await supabase.from("blog_post_tags").insert(
    tagIds.map((tag_id) => ({
      post_id: postId,
      tag_id,
    })),
  );

  if (error) throw new Error(error.message);
}

async function syncPostRelated(
  supabase: Awaited<ReturnType<typeof createClient>>,
  postId: string,
  relatedPostIds: string[],
) {
  const uniqueIds = [
    ...new Set(relatedPostIds.filter((relatedId) => relatedId !== postId)),
  ];

  await supabase.from("blog_post_related").delete().eq("post_id", postId);

  if (uniqueIds.length === 0) return;

  const { error } = await supabase.from("blog_post_related").insert(
    uniqueIds.map((related_post_id) => ({
      post_id: postId,
      related_post_id,
    })),
  );

  if (error) throw new Error(error.message);
}

export async function listBlogPostOptions(): Promise<
  BlogActionResult<BlogPostRef[]>
> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, published")
      .order("title");

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: data ?? [] };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function createBlogPost(
  input: BlogPostInput,
): Promise<BlogActionResult<BlogPostWithRelations>> {
  try {
    const supabase = await requireAdmin();
    const slug = slugify(input.slug || input.title);

    if (!slug) {
      return { ok: false, error: "Podaj tytuł artykułu." };
    }

    if (!input.cover_image_url?.trim()) {
      return { ok: false, error: "Główne zdjęcie jest wymagane." };
    }

    if (input.tag_ids.length === 0) {
      return { ok: false, error: "Wybierz co najmniej jeden tag." };
    }

    if (input.reading_time_minutes < 1) {
      return { ok: false, error: "Czas czytania musi wynosić co najmniej 1 minutę." };
    }

    const publishedAt = input.published ? new Date().toISOString() : null;

    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title: input.title.trim(),
        slug,
        excerpt: input.excerpt.trim(),
        content_html: input.content_html,
        cover_image_url: input.cover_image_url,
        author_id: input.author_id,
        published: input.published,
        published_at: publishedAt,
        reading_time_minutes: input.reading_time_minutes,
        show_in_news: input.show_in_news,
      })
      .select("id")
      .single();

    if (error) return { ok: false, error: error.message };

    await syncPostTags(supabase, data.id, input.tag_ids);
    await syncPostRelated(supabase, data.id, input.related_post_ids);

    const post = await getBlogPost(data.id);
    revalidateBlogPublicPaths();
    return post;
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Brak autoryzacji.",
    };
  }
}

export async function updateBlogPost(
  id: string,
  input: BlogPostInput,
): Promise<BlogActionResult<BlogPostWithRelations>> {
  try {
    const supabase = await requireAdmin();
    const slug = slugify(input.slug || input.title);

    if (!slug) {
      return { ok: false, error: "Podaj tytuł artykułu." };
    }

    if (!input.cover_image_url?.trim()) {
      return { ok: false, error: "Główne zdjęcie jest wymagane." };
    }

    if (input.tag_ids.length === 0) {
      return { ok: false, error: "Wybierz co najmniej jeden tag." };
    }

    if (input.reading_time_minutes < 1) {
      return { ok: false, error: "Czas czytania musi wynosić co najmniej 1 minutę." };
    }

    const { data: existing } = await supabase
      .from("blog_posts")
      .select("published, published_at")
      .eq("id", id)
      .single();

    let publishedAt = existing?.published_at ?? null;

    if (input.published && !existing?.published) {
      publishedAt = new Date().toISOString();
    } else if (!input.published) {
      publishedAt = null;
    }

    const { error } = await supabase
      .from("blog_posts")
      .update({
        title: input.title.trim(),
        slug,
        excerpt: input.excerpt.trim(),
        content_html: input.content_html,
        cover_image_url: input.cover_image_url,
        author_id: input.author_id,
        published: input.published,
        published_at: publishedAt,
        reading_time_minutes: input.reading_time_minutes,
        show_in_news: input.show_in_news,
      })
      .eq("id", id);

    if (error) return { ok: false, error: error.message };

    await syncPostTags(supabase, id, input.tag_ids);
    await syncPostRelated(supabase, id, input.related_post_ids);

    const post = await getBlogPost(id);
    revalidateBlogPublicPaths();
    return post;
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Brak autoryzacji.",
    };
  }
}

export async function deleteBlogPost(id: string): Promise<BlogActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidateBlogPublicPaths();
    return { ok: true };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function setFeaturedBlogPost(
  postId: string | null,
): Promise<BlogActionResult> {
  try {
    const supabase = await requireAdmin();

    const { error: unsetError } = await supabase
      .from("blog_posts")
      .update({ is_featured: false })
      .eq("is_featured", true);

    if (unsetError) return { ok: false, error: unsetError.message };

    if (!postId) {
      revalidateBlogPublicPaths();
      return { ok: true };
    }

    const { error } = await supabase
      .from("blog_posts")
      .update({ is_featured: true })
      .eq("id", postId);

    if (error) return { ok: false, error: error.message };

    revalidateBlogPublicPaths();
    return { ok: true };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}
