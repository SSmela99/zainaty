import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, VideoIcon } from "lucide-react";

import { CourseDiscountBadge, CoursePrice } from "@/components/courses/course-price";
import { getCourseExcerpt } from "@/lib/courses/format";
import type { Course } from "@/lib/courses/types";
import { coursePath } from "@/lib/paths";

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      href={coursePath(course.slug)}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl border border-[#ded9cf] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#ff4b12]/40 hover:shadow-[0_20px_48px_rgba(0,0,0,0.12)] dark:border-[#282828] dark:bg-[#1c1c1c] dark:hover:border-[#d7ff00]/40 dark:hover:shadow-[0_24px_56px_rgba(0,0,0,0.45)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#d7ff00]/20 dark:bg-[#3a3d10]/40">
        {course.cover_image_url ? (
          <Image
            src={course.cover_image_url}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-center text-4xl font-black tracking-[-0.04em] text-[#ff4b12] dark:text-[#d7ff00]">
            {course.title}
          </div>
        )}

        <CourseDiscountBadge
          price={course.price}
          discountPrice={course.discount_price}
          className="absolute top-4 left-4 px-2.5 py-1"
        />

        {course.kind === "video" ? (
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-zinc-950/75 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm dark:bg-black/70">
            <VideoIcon className="size-3.5" strokeWidth={2.5} />
            Wideo
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h2 className="text-lg leading-snug font-black tracking-[-0.02em] text-zinc-950 transition-colors group-hover:text-[#ff4b12] dark:text-white dark:group-hover:text-[#d7ff00]">
          {course.title}
        </h2>

        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {getCourseExcerpt(course.description)}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-zinc-100 pt-5 dark:border-zinc-800">
          <CoursePrice
            price={course.price}
            discountPrice={course.discount_price}
            size="sm"
          />

          <span
            aria-hidden
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ffe1cc] text-[#ff4b12] transition-colors group-hover:bg-[#ff4b12] group-hover:text-white dark:bg-[#3a3d10] dark:text-[#d7ff00] dark:group-hover:bg-[#d7ff00] dark:group-hover:text-zinc-950"
          >
            <ArrowRightIcon className="size-3.5" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </Link>
  );
}
