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
      <p className="rounded-3xl border border-dashed border-[#ded9cf] px-6 py-16 text-center text-sm text-zinc-600 dark:border-[#282828] dark:text-zinc-400">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
