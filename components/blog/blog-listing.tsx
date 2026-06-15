import Link from "next/link";

import { BlogPostCard } from "@/components/blog/blog-post-card";
import { PATHS } from "@/lib/paths";
import type { BlogPostWithRelations, Tag } from "@/lib/blog/types";
import { cn } from "@/lib/utils";

type BlogListingProps = {
  posts: BlogPostWithRelations[];
  tags: Tag[];
  activeTagSlug: string | null;
  featuredPostId?: string | null;
};

function blogListingHref(tagSlug: string | null): string {
  if (!tagSlug) return PATHS.BLOG;

  return `${PATHS.BLOG}?tag=${encodeURIComponent(tagSlug)}`;
}

export function BlogListing({
  posts,
  tags,
  activeTagSlug,
  featuredPostId,
}: BlogListingProps) {
  const gridPosts = featuredPostId
    ? posts.filter((post) => post.id !== featuredPostId)
    : posts;

  return (
    <div>
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          <Link
            href={blogListingHref(null)}
            scroll={false}
            className={cn(
              "cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition-colors",
              activeTagSlug == null
                ? "bg-[#ff4b12] text-white dark:bg-[#d7ff00] dark:text-zinc-950"
                : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-[#1c1c1c] dark:text-zinc-300 dark:hover:bg-zinc-800",
            )}
          >
            Wszystkie
          </Link>

          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={blogListingHref(tag.slug)}
              scroll={false}
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition-colors",
                activeTagSlug === tag.slug
                  ? "bg-[#ff4b12] text-white dark:bg-[#d7ff00] dark:text-zinc-950"
                  : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-[#1c1c1c] dark:text-zinc-300 dark:hover:bg-zinc-800",
              )}
            >
              {tag.name}
            </Link>
          ))}
        </div>
      ) : null}

      {gridPosts.length === 0 ? (
        <p className="mt-10 text-sm text-zinc-500 dark:text-zinc-400">
          {activeTagSlug
            ? "Brak artykułów w wybranej kategorii."
            : "Brak opublikowanych artykułów."}
        </p>
      ) : (
        <ul className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {gridPosts.map((post) => (
            <li key={post.id}>
              <BlogPostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
