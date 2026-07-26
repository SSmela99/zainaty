"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarIcon } from "lucide-react";

import { handleConsultationRedirect } from "@/lib/consultation";
import { getPrimaryTagName } from "@/lib/blog/format";
import type { BlogPostWithRelations } from "@/lib/blog/types";

type BlogRelatedSidebarProps = {
  posts: BlogPostWithRelations[];
};

export function BlogRelatedSidebar({ posts }: BlogRelatedSidebarProps) {
  if (posts.length === 0) return null;

  return (
    <aside className="rounded-3xl bg-white p-5 shadow-sm dark:bg-[#1c1c1c] dark:shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
      <p className="text-[11px] font-bold tracking-[0.18em] text-zinc-950 uppercase dark:text-white">
        Powiązane artykuły
      </p>

      <ul className="mt-4 space-y-3">
        {posts.map((post) => {
          const primaryTag = getPrimaryTagName(post.tags);

          return (
            <li key={post.id}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex gap-3 rounded-2xl p-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
              >
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#f5f2e9] dark:bg-[#242424]">
                  {post.cover_image_url ? (
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : null}
                </div>

                <div className="min-w-0">
                  {primaryTag ? (
                    <span className="inline-block rounded-full bg-[#ffd0bc] px-2 py-0.5 text-[10px] font-bold tracking-wide text-[#f24a00] uppercase dark:bg-[#3a4500] dark:text-[#daff02]">
                      {primaryTag}
                    </span>
                  ) : null}

                  <p
                    className={`line-clamp-3 text-sm leading-snug font-bold text-zinc-950 transition-colors group-hover:text-[#f24a00] dark:text-white dark:group-hover:text-[#daff02] ${primaryTag ? "mt-1.5" : ""}`}
                  >
                    {post.title}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export function BlogConsultationCta() {
  return (
    <aside className="rounded-3xl bg-[#f24a00] p-6 dark:bg-[#daff02]">
      <h2 className="text-lg font-black tracking-[0.02em] text-white dark:text-zinc-950">
        Chcesz więcej?
      </h2>
      <p className="mt-2 text-sm leading-6 text-white/90 dark:text-zinc-900">
        Umów się na bezpłatną konsultację i porozmawiajmy o Twoich potrzebach.
      </p>

      <button
        type="button"
        onClick={handleConsultationRedirect}
        className="mt-5 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black text-[#f24a00] transition-transform hover:-translate-y-0.5 hover:scale-[1.02] dark:bg-zinc-950 dark:text-[#daff02]"
      >
        <CalendarIcon className="size-4" strokeWidth={2.2} />
        Zarezerwuj termin
      </button>
    </aside>
  );
}
