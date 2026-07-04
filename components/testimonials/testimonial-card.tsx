import Image from "next/image";
import { StarIcon } from "lucide-react";

import type { Testimonial } from "@/lib/testimonials/types";
import { cn } from "@/lib/utils";

type TestimonialCardProps = {
  testimonial: Testimonial;
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-3xl border border-[#ded9cf] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300",
        "hover:-translate-y-1 hover:border-[#ff4b12]/35 hover:shadow-[0_20px_48px_rgba(0,0,0,0.12)]",
        "dark:border-[#282828] dark:bg-[#1c1c1c] dark:shadow-[0_16px_48px_rgba(0,0,0,0.35)]",
        "dark:hover:border-[#d7ff00]/35 dark:hover:shadow-[0_24px_56px_rgba(0,0,0,0.45)]",
      )}
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: testimonial.rating }).map((_, index) => (
          <StarIcon
            key={index}
            className="size-4 fill-[#ff4b12] text-[#ff4b12] dark:fill-[#d7ff00] dark:text-[#d7ff00]"
            strokeWidth={0}
          />
        ))}
      </div>

      <blockquote className="mt-5 flex-1 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
        „{testimonial.content}”
      </blockquote>

      <footer className="mt-6 flex items-center gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800">
        {testimonial.avatar_url ? (
          <div className="relative size-11 shrink-0 overflow-hidden rounded-full border-2 border-[#ff4b12]/30 dark:border-[#d7ff00]/40">
            <Image
              src={testimonial.avatar_url}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-[#ff4b12]/30 bg-[#ffe1cc] text-xs font-black text-[#ff4b12] dark:border-[#d7ff00]/40 dark:bg-[#3a3d10] dark:text-[#d7ff00]">
            {getInitials(testimonial.author_name)}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate font-bold text-zinc-950 dark:text-white">
            {testimonial.author_name}
          </p>
          <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
            {testimonial.author_role}
          </p>
        </div>
      </footer>
    </article>
  );
}
