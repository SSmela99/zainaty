import Image from "next/image";

import type { Author } from "@/lib/blog/types";

type BlogAuthorSidebarProps = {
  author: Author;
};

function getAuthorInitials(author: Author): string {
  return `${author.first_name.charAt(0)}${author.last_name.charAt(0)}`.toUpperCase();
}

export function BlogAuthorSidebar({ author }: BlogAuthorSidebarProps) {
  return (
    <aside className="rounded-3xl bg-white p-6 shadow-sm dark:bg-[#1c1c1c] dark:shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
      <p className="text-[11px] font-bold tracking-[0.18em] text-zinc-950 uppercase dark:text-white">
        O autorze
      </p>

      <div className="mt-5 flex items-center gap-3">
        {author.photo_url ? (
          <div className="relative size-14 shrink-0 overflow-hidden rounded-full">
            <Image
              src={author.photo_url}
              alt={`${author.first_name} ${author.last_name}`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#dfe5ff] text-sm font-bold text-[#0033ff] dark:bg-[#1a2a5e] dark:text-[#6688ff]">
            {getAuthorInitials(author)}
          </div>
        )}

        <div>
          <p className="font-bold text-zinc-950 dark:text-white">
            {author.first_name} {author.last_name}
          </p>
          {author.position ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{author.position}</p>
          ) : null}
        </div>
      </div>

      {author.description ? (
        <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {author.description}
        </p>
      ) : null}
    </aside>
  );
}
