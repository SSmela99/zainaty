import Image from "next/image";
import Link from "next/link";
import { ClockIcon } from "lucide-react";

import { BlogImageChip, BlogImageChips } from "@/components/blog/blog-image-chip";
import {
  formatBlogDate,
  formatReadingTime,
  getPrimaryTagName,
} from "@/lib/blog/format";
import type { BlogPostWithRelations } from "@/lib/blog/types";

type HomeBlogFeaturedCardProps = {
  post: BlogPostWithRelations;
};

export function HomeBlogFeaturedCard({ post }: HomeBlogFeaturedCardProps) {
  const primaryTag = getPrimaryTagName(post.tags);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid h-full min-h-0 cursor-pointer grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-3xl border border-[#d5d0c6] bg-[#ebe6dc] shadow-[0_8px_28px_rgba(0,0,0,0.05)] transition-[border-color,box-shadow] duration-300 hover:border-[#ff4b12]/35 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] dark:border-[#282828] dark:bg-[#1c1c1c] dark:shadow-[0_12px_36px_rgba(0,0,0,0.32)] dark:hover:border-[#d7ff00]/35 dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.38)] max-lg:grid-rows-[auto_auto]"
    >
      <div className="relative aspect-[4/3] min-h-0 overflow-hidden bg-[#f7f3ea] lg:aspect-auto dark:bg-[#242424]">
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            unoptimized
            priority
          />
        ) : null}

        {primaryTag ? (
          <BlogImageChips className="top-4 left-4">
            <BlogImageChip>{primaryTag}</BlogImageChip>
          </BlogImageChips>
        ) : null}
      </div>

      <div className="shrink-0 p-5 md:p-6">
        <h3 className="line-clamp-2 text-lg leading-snug font-black tracking-[-0.02em] text-zinc-950 transition-colors group-hover:text-[#ff4b12] md:text-xl dark:text-white dark:group-hover:text-[#d7ff00]">
          {post.title}
        </h3>

        {post.excerpt ? (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {post.excerpt}
          </p>
        ) : null}

        <p className="mt-4 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <ClockIcon className="size-4 shrink-0" strokeWidth={2.2} />
          {formatReadingTime(post.reading_time_minutes)}
          {post.published_at ? (
            <>
              <span aria-hidden>·</span>
              {formatBlogDate(post.published_at)}
            </>
          ) : null}
        </p>
      </div>
    </Link>
  );
}
