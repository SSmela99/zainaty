import Link from "next/link";

import { getFeaturedCourses } from "@/lib/courses/queries";
import { PATHS } from "@/lib/paths";

import { FeaturedCoursesSlider } from "./featured-courses-slider";

export async function FeaturedCoursesSection() {
  const courses = await getFeaturedCourses();

  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f2efe6] py-16 md:py-24 dark:bg-[#111111]">
      <div className="mx-auto max-w-375 px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[13px] font-bold tracking-[0.22em] text-[#1a4dff] uppercase dark:text-[#7d9bff]">
              Nasza biblioteka
            </p>
            <h2 className="mt-4 text-3xl leading-[1.1] font-black tracking-[-0.03em] text-zinc-950 md:text-5xl dark:text-white">
              Polecane{" "}
              <span className="text-[#ff4b12] dark:text-[#d7ff00]">kursy</span>
            </h2>
          </div>

          <Link
            href={PATHS.COURSES_TRAININGS}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#ff4b12] transition-opacity hover:opacity-75 dark:text-[#d7ff00]"
          >
            Zobacz wszystkie
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-10 md:mt-12">
          <FeaturedCoursesSlider courses={courses} />
        </div>
      </div>
    </section>
  );
}
