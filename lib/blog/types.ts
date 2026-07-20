export type Author = {
  id: string;
  first_name: string;
  last_name: string;
  position: string;
  description: string;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type BlogPostRef = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  cover_image_url: string | null;
  author_id: string | null;
  published: boolean;
  published_at: string | null;
  is_featured: boolean;
  show_in_news: boolean;
  reading_time_minutes: number;
  created_at: string;
  updated_at: string;
};

export type BlogPostWithRelations = BlogPost & {
  author: Author | null;
  tags: Tag[];
  related_posts: BlogPostRef[];
};

export type AuthorInput = {
  first_name: string;
  last_name: string;
  position: string;
  description: string;
  photo_url: string | null;
};

export type TagInput = {
  name: string;
};

export type BlogPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  cover_image_url: string | null;
  author_id: string | null;
  tag_ids: string[];
  related_post_ids: string[];
  reading_time_minutes: number;
  published: boolean;
  show_in_news: boolean;
};

export type BlogActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };
