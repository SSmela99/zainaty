import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ClockIcon } from "lucide-react";

import {
  formatBlogDate,
  formatShortReadingTime,
  getPrimaryTagName,
} from "@/lib/blog/format";
import type { BlogPostWithRelations } from "@/lib/blog/types";

type HomeBlogLatestCardProps = {
  post: BlogPostWithRelations;
};

export function HomeBlogLatestCard({ post }: HomeBlogLatestCardProps) {
  const primaryTag = getPrimaryTagName(post.tags);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex cursor-pointer overflow-hidden rounded-3xl border border-[#d5d0c6] bg-[#ebe6dc] shadow-[0_8px_28px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#f24a00]/35 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] dark:border-[#282828] dark:bg-[#1c1c1c] dark:shadow-[0_12px_36px_rgba(0,0,0,0.32)] dark:hover:border-[#daff02]/35 dark:hover:shadow-[0_20px_48px_rgba(0,0,0,0.42)]"
    >
      <div className="relative w-20 shrink-0 self-stretch bg-[#ddd8ce] md:w-24 dark:bg-[#242424]">
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            unoptimized
          />
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-4 py-5 pr-5 pl-5 md:gap-5 md:py-5 md:pr-6 md:pl-6">
        <div className="min-w-0 flex-1">
          {primaryTag ? (
            <p className="text-[11px] font-bold tracking-[0.18em] text-[#0033ff] uppercase dark:text-[#6688ff]">
              {primaryTag}
            </p>
          ) : null}

          <h3 className="mt-1 line-clamp-2 text-base leading-snug font-black tracking-[0.02em] text-zinc-950 transition-colors group-hover:text-[#f24a00] dark:text-white dark:group-hover:text-[#daff02]">
            {post.title}
          </h3>

          <p className="mt-2 flex items-center gap-2 text-xs text-zinc-500 md:text-sm dark:text-zinc-400">
            <ClockIcon className="size-3.5 shrink-0" strokeWidth={2.2} />
            {formatShortReadingTime(post.reading_time_minutes)}
            {post.published_at ? (
              <>
                <span aria-hidden>·</span>
                {formatBlogDate(post.published_at)}
              </>
            ) : null}
          </p>
        </div>

        <span
          aria-hidden
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ffd0bc] text-[#f24a00] transition-colors group-hover:bg-[#f24a00] group-hover:text-white md:size-9 dark:bg-[#3a4500] dark:text-[#daff02] dark:group-hover:bg-[#daff02] dark:group-hover:text-zinc-950"
        >
          <ArrowRightIcon className="size-3.5" strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}
