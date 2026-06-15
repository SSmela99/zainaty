import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { BlogAuthorMeta } from "@/components/blog/blog-author-meta";
import { BlogImageChip, BlogImageChips } from "@/components/blog/blog-image-chip";
import { sortTagsByName } from "@/lib/blog/format";
import type { BlogPostWithRelations } from "@/lib/blog/types";

type BlogFeaturedCardProps = {
  post: BlogPostWithRelations;
};

export function BlogFeaturedCard({ post }: BlogFeaturedCardProps) {
  const tags = sortTagsByName(post.tags);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block cursor-pointer overflow-hidden rounded-3xl border-2 border-transparent bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[#ff4b12] hover:shadow-[0_20px_48px_rgba(0,0,0,0.14)] dark:bg-[#1c1c1c] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] dark:hover:border-[#d7ff00] dark:hover:shadow-[0_24px_56px_rgba(0,0,0,0.55)]"
    >
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-64 overflow-hidden bg-[#f7f3eb] lg:min-h-80 dark:bg-[#242424]">
          {post.cover_image_url ? (
            <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.07]">
              <Image
                src={post.cover_image_url}
                alt=""
                fill
                className="object-cover"
                unoptimized
                priority
              />
            </div>
          ) : null}

          <BlogImageChips className="top-5 left-5 flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <BlogImageChip>Wyróżniony</BlogImageChip>
            {tags.map((tag) => (
              <BlogImageChip key={tag.id}>{tag.name}</BlogImageChip>
            ))}
          </BlogImageChips>
        </div>

        <div className="flex flex-col justify-between gap-8 p-6 md:p-8 lg:p-10">
          <div>
            <h2 className="text-2xl leading-tight font-black tracking-[-0.02em] text-zinc-950 transition-colors group-hover:text-[#ff4b12] md:text-3xl dark:text-white dark:group-hover:text-[#d7ff00]">
              {post.title}
            </h2>

            {post.excerpt ? (
              <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                {post.excerpt}
              </p>
            ) : null}
          </div>

          <div className="flex items-end justify-between gap-4">
            <BlogAuthorMeta
              author={post.author}
              publishedAt={post.published_at}
              readingTimeMinutes={post.reading_time_minutes}
            />

            <span
              aria-hidden
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[#ffe1cc] text-[#ff4b12] transition-colors group-hover:bg-[#ff4b12] group-hover:text-white dark:bg-[#3a3d10] dark:text-[#d7ff00] dark:group-hover:bg-[#d7ff00] dark:group-hover:text-zinc-950"
            >
              <ArrowRightIcon className="size-4" strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
