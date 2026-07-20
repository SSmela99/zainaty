import Link from "next/link";

import type { UserAccessibleCourse } from "@/lib/courses/user-courses.shared";

import { AccountCourseRow } from "./account-course-row";
import { accountPageContent } from "./account-page.utils";

type AccountCoursesTabProps = {
  courses: UserAccessibleCourse[];
};

function formatPurchasedAt(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export function AccountCoursesTab({ courses }: AccountCoursesTabProps) {
  const content = accountPageContent.courses;

  if (courses.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#ddd8ce] bg-[#f5f2e9]/60 px-8 py-12 text-center dark:border-[#333333] dark:bg-[#151414]/60">
        <h2 className="text-lg font-black text-zinc-950 dark:text-white">
          {content.emptyTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {content.emptyDescription}
        </p>
        <Link
          href={content.browseHref}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[#f24a00] px-6 text-sm font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-[1.02] dark:bg-[#daff02] dark:text-zinc-950"
        >
          {content.browseLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {courses.map((course) => (
        <AccountCourseRow
          key={course.id}
          course={course}
          purchasedAtLabel={formatPurchasedAt(course.purchased_at)}
        />
      ))}
    </div>
  );
}
