import type { Author, BlogPostRef, BlogPostWithRelations, Tag } from "@/lib/blog/types";
import { createClient } from "@/lib/supabase/server";

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

function mapPost(row: Record<string, unknown>): BlogPostWithRelations {
  const tagRows = (row.blog_post_tags as Array<{ tag: Tag | null }> | null) ?? [];
  const relatedRows =
    (row.blog_post_related as Array<{ related_post: BlogPostRef | null }> | null) ?? [];

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
    reading_time_minutes: (row.reading_time_minutes as number | undefined) ?? 5,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    author: (row.author as Author | null) ?? null,
    tags: tagRows.flatMap((entry) => (entry.tag ? [entry.tag] : [])),
    related_posts: relatedRows.flatMap((entry) =>
      entry.related_post?.published ? [entry.related_post] : [],
    ),
  };
}

export async function getFeaturedBlogPost(): Promise<BlogPostWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(POST_SELECT)
    .eq("published", true)
    .eq("is_featured", true)
    .maybeSingle();

  if (error || !data) return null;
  return mapPost(data);
}

export async function getPublishedBlogPosts(
  tagSlug?: string | null,
): Promise<BlogPostWithRelations[]> {
  const supabase = await createClient();

  if (tagSlug) {
    const { data: tag, error: tagError } = await supabase
      .from("tags")
      .select("id")
      .eq("slug", tagSlug)
      .maybeSingle();

    if (tagError || !tag) return [];

    const { data: links, error: linksError } = await supabase
      .from("blog_post_tags")
      .select("post_id")
      .eq("tag_id", tag.id);

    if (linksError || !links?.length) return [];

    const postIds = links.map((link) => link.post_id);

    const { data, error } = await supabase
      .from("blog_posts")
      .select(POST_SELECT)
      .eq("published", true)
      .in("id", postIds)
      .order("published_at", { ascending: false });

    if (error || !data) return [];
    return data.map(mapPost);
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select(POST_SELECT)
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapPost);
}

export async function getBlogFilterTags(): Promise<Tag[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("blog_post_tags(tag:tags(*))")
    .eq("published", true);

  if (error || !data) return [];

  const tagMap = new Map<string, Tag>();

  for (const row of data) {
    const tagRows =
      (row.blog_post_tags as unknown as Array<{ tag: Tag | null }> | null) ??
      [];

    for (const entry of tagRows) {
      if (entry.tag) tagMap.set(entry.tag.id, entry.tag);
    }
  }

  return [...tagMap.values()].sort((a, b) => a.name.localeCompare(b.name, "pl"));
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPostWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(POST_SELECT)
    .eq("published", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return mapPost(data);
}
