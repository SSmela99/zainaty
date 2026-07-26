import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { BlogAuthorMeta } from "@/components/blog/blog-author-meta";
import { BlogImageChip, BlogImageChips } from "@/components/blog/blog-image-chip";
import { sortTagsByName } from "@/lib/blog/format";
import type { BlogPostWithRelations } from "@/lib/blog/types";

type BlogPostCardProps = {
  post: BlogPostWithRelations;
};

export function BlogPostCard({ post }: BlogPostCardProps) {
  const tags = sortTagsByName(post.tags);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border-2 border-transparent bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#f24a00] hover:shadow-[0_20px_48px_rgba(0,0,0,0.14)] dark:bg-[#1c1c1c] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] dark:hover:border-[#daff02] dark:hover:shadow-[0_24px_56px_rgba(0,0,0,0.55)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f5f2e9] dark:bg-[#242424]">
        {post.cover_image_url ? (
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.07]">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : null}

        {tags.length > 0 ? (
          <BlogImageChips>
            {tags.map((tag) => (
              <BlogImageChip key={tag.id}>{tag.name}</BlogImageChip>
            ))}
          </BlogImageChips>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h2 className="text-lg leading-snug font-black tracking-[0.02em] text-zinc-950 transition-colors group-hover:text-[#f24a00] dark:text-white dark:group-hover:text-[#daff02]">
          {post.title}
        </h2>

        {post.excerpt ? (
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {post.excerpt}
          </p>
        ) : (
          <div className="flex-1" />
        )}

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-zinc-100 pt-5 dark:border-zinc-800">
          <BlogAuthorMeta
            author={post.author}
            publishedAt={post.published_at}
            readingTimeMinutes={post.reading_time_minutes}
            compact
          />

          <span
            aria-hidden
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ffd0bc] text-[#f24a00] transition-colors group-hover:bg-[#f24a00] group-hover:text-white dark:bg-[#3a4500] dark:text-[#daff02] dark:group-hover:bg-[#daff02] dark:group-hover:text-zinc-950"
          >
            <ArrowRightIcon className="size-3.5" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </Link>
  );
}
