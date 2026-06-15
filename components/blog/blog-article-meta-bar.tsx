import Image from "next/image";
import { CalendarIcon, ClockIcon } from "lucide-react";

import { formatBlogDate, formatReadingTime } from "@/lib/blog/format";
import type { Author, Tag } from "@/lib/blog/types";

type BlogArticleMetaBarProps = {
  author: Author | null;
  publishedAt: string | null;
  readingTimeMinutes: number;
  tags: Tag[];
};

function getAuthorInitials(author: Author): string {
  return `${author.first_name.charAt(0)}${author.last_name.charAt(0)}`.toUpperCase();
}

export function BlogArticleMetaBar({
  author,
  publishedAt,
  readingTimeMinutes,
  tags,
}: BlogArticleMetaBarProps) {
  return (
    <div className="flex flex-col gap-5 border-b border-[#ded9cf] pb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6 dark:border-zinc-800">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        {author ? (
          <div className="flex min-w-0 items-center gap-3">
            {author.photo_url ? (
              <div className="relative size-11 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={author.photo_url}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#dfe5ff] text-xs font-bold text-[#1a4dff] dark:bg-[#1a2a5e] dark:text-[#7d9bff]">
                {getAuthorInitials(author)}
              </div>
            )}

            <div className="min-w-0">
              <p className="font-bold text-zinc-950 dark:text-white">
                {author.first_name} {author.last_name}
              </p>
              {author.position ? (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {author.position}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-600 dark:text-zinc-400">
          {publishedAt ? (
            <span className="inline-flex items-center gap-2">
              <CalendarIcon className="size-4 shrink-0" strokeWidth={2} />
              {formatBlogDate(publishedAt)}
            </span>
          ) : null}

          <span className="inline-flex items-center gap-2">
            <ClockIcon className="size-4 shrink-0" strokeWidth={2} />
            {formatReadingTime(readingTimeMinutes)}
          </span>
        </div>
      </div>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2 sm:justify-end">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full bg-[#ffe1cc] px-3 py-1 text-[11px] font-bold tracking-wide text-[#ff4b12] uppercase dark:bg-[#3a3d10] dark:text-[#d7ff00]"
            >
              {tag.name}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
