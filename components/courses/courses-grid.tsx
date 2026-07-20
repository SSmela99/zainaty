import { Reveal } from "@/components/reveal";
import type { Course } from "@/lib/courses/types";

import { CourseCard } from "./course-card";

type CoursesGridProps = {
  courses: Course[];
  emptyMessage?: string;
};

export function CoursesGrid({
  courses,
  emptyMessage = "Wkrótce pojawią się tutaj kursy. Zajrzyj ponownie za chwilę.",
}: CoursesGridProps) {
  if (courses.length === 0) {
    return (
      <p className="rounded-3xl border border-dashed border-[#ddd8ce] px-6 py-16 text-center text-sm text-zinc-600 dark:border-[#282828] dark:text-zinc-400">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course, index) => (
        <Reveal key={course.id} delay={index * 0.08} className="h-full">
          <CourseCard course={course} />
        </Reveal>
      ))}
    </div>
  );
}
