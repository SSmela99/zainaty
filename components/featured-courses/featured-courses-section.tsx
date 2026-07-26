import Link from "next/link";

import { Reveal } from "@/components/reveal";
import { getFeaturedCourses } from "@/lib/courses/queries";
import { PATHS } from "@/lib/paths";

import { FeaturedCoursesSlider } from "./featured-courses-slider";

export async function FeaturedCoursesSection() {
  const courses = await getFeaturedCourses();

  if (courses.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f1eee5] py-16 md:py-24 dark:bg-[#1a1919]">
      <div className="mx-auto max-w-425 px-14 md:px-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[13px] font-bold tracking-[0.22em] text-[#0033ff] uppercase dark:text-[#6688ff]">
                Nasza biblioteka
              </p>
              <h2 className="mt-4 text-3xl leading-[1.1] font-black tracking-[0.02em] text-zinc-950 md:text-5xl dark:text-white">
                Polecane{" "}
                <span className="text-[#f24a00] dark:text-[#daff02]">kursy</span>
              </h2>
            </div>

            <Link
              href={PATHS.COURSES_TRAININGS}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#f24a00] transition-opacity hover:opacity-75 dark:text-[#daff02]"
            >
              Zobacz wszystkie
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 md:mt-12">
          <FeaturedCoursesSlider courses={courses} />
        </div>
      </div>
    </section>
  );
}
