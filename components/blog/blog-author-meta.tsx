import Image from "next/image";

import { formatBlogDate, formatReadingTime } from "@/lib/blog/format";
import type { Author } from "@/lib/blog/types";

type BlogAuthorMetaProps = {
  author: Author | null;
  publishedAt: string | null;
  readingTimeMinutes: number;
  compact?: boolean;
};

function getAuthorInitials(author: Author): string {
  return `${author.first_name.charAt(0)}${author.last_name.charAt(0)}`.toUpperCase();
}

export function BlogAuthorMeta({
  author,
  publishedAt,
  readingTimeMinutes,
  compact = false,
}: BlogAuthorMetaProps) {
  if (!author) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        {formatBlogDate(publishedAt)}
        {publishedAt ? " · " : ""}
        {formatReadingTime(readingTimeMinutes)}
      </p>
    );
  }

  const avatarSize = compact ? "size-9" : "size-10";

  return (
    <div className="flex items-center gap-3">
      {author.photo_url ? (
        <div className={`relative ${avatarSize} shrink-0 overflow-hidden rounded-full`}>
          <Image
            src={author.photo_url}
            alt={`${author.first_name} ${author.last_name}`}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      ) : (
        <div
          className={`flex ${avatarSize} shrink-0 items-center justify-center rounded-full bg-[#dfe5ff] text-xs font-bold text-[#0033ff] dark:bg-[#1a2a5e] dark:text-[#6688ff]`}
        >
          {getAuthorInitials(author)}
        </div>
      )}

      <div>
        <p className="text-sm font-bold text-zinc-950 dark:text-white">
          {author.first_name} {author.last_name}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {formatBlogDate(publishedAt)}
          {publishedAt ? " · " : ""}
          {formatReadingTime(readingTimeMinutes)}
        </p>
      </div>
    </div>
  );
}
