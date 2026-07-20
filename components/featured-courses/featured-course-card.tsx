import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { formatCoursePriceCompact } from "@/lib/courses/format";
import type { Course } from "@/lib/courses/types";
import { coursePath } from "@/lib/paths";

type FeaturedCourseCardProps = {
  course: Course;
};

export function FeaturedCourseCard({ course }: FeaturedCourseCardProps) {
  const displayPrice = course.discount_price ?? course.price;

  return (
    <Link
      href={coursePath(course.slug)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl bg-[#ddd2c2] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] dark:bg-[#1c1c1c] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.34)]"
    >
      <div className="relative aspect-square overflow-hidden bg-[#daff02]/20 dark:bg-[#3a4500]/40">
        {course.cover_image_url ? (
          <Image
            src={course.cover_image_url}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-2xl font-black tracking-[-0.03em] text-[#f24a00] dark:text-[#daff02]">
            {course.title}
          </div>
        )}
      </div>

      <div className="flex flex-1 items-end justify-between gap-3 p-4 md:p-5">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-base leading-snug font-black tracking-[-0.02em] text-zinc-950 md:text-lg dark:text-white">
            {course.title}
          </h3>
          <p className="mt-2 text-base font-black text-[#f24a00] md:text-lg dark:text-[#daff02]">
            {formatCoursePriceCompact(displayPrice)}
          </p>
        </div>

        <span
          aria-hidden
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-[#f24a00]/25 bg-[#f5e0d4] text-[#f24a00] transition-all duration-300 ease-out group-hover:border-[#f24a00] group-hover:bg-[#f24a00] group-hover:text-white dark:border-[#daff02]/25 dark:bg-[#3a4500] dark:text-[#daff02] dark:group-hover:border-[#daff02] dark:group-hover:bg-[#daff02] dark:group-hover:text-zinc-950"
        >
          <ArrowRightIcon className="size-3.5" strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}
