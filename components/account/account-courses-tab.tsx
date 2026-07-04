import { FileTextIcon, VideoIcon } from "lucide-react";
import Link from "next/link";

import type { UserAccessibleCourse } from "@/lib/courses/user-courses";
import { coursePath } from "@/lib/paths";
import { cn } from "@/lib/utils";

import { accountPageContent } from "./account-page.utils";
import { CourseFileDownloadButton } from "./course-file-download-button";

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

function FileTypeIcon({ fileType }: { fileType: "pdf" | "video" }) {
  if (fileType === "video") {
    return <VideoIcon className="size-4 shrink-0" strokeWidth={2.2} />;
  }

  return <FileTextIcon className="size-4 shrink-0" strokeWidth={2.2} />;
}

export function AccountCoursesTab({ courses }: AccountCoursesTabProps) {
  const content = accountPageContent.courses;

  if (courses.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#ded9cf] bg-[#f7f3ea]/60 px-8 py-12 text-center dark:border-[#333333] dark:bg-[#141414]/60">
        <h2 className="text-lg font-black text-zinc-950 dark:text-white">
          {content.emptyTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {content.emptyDescription}
        </p>
        <Link
          href={content.browseHref}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[#ff4b12] px-6 text-sm font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-[1.02] dark:bg-[#d7ff00] dark:text-zinc-950"
        >
          {content.browseLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {courses.map((course) => (
        <article
          key={course.id}
          className="h-full rounded-3xl border border-[#ded9cf] bg-white p-6 dark:border-[#282828] dark:bg-[#1c1c1c]"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Link
                href={coursePath(course.slug)}
                className="text-xl font-black tracking-[-0.02em] text-zinc-950 transition-colors hover:text-[#ff4b12] dark:text-white dark:hover:text-[#d7ff00]"
              >
                {course.title}
              </Link>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {content.purchasedAt}: {formatPurchasedAt(course.purchased_at)}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
              {content.filesHeading}
            </h3>

            {course.files.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                {content.noFiles}
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {course.files.map((file) => (
                  <li
                    key={file.id}
                    className={cn(
                      "flex flex-col gap-3 rounded-2xl border border-[#ede8de] bg-[#f7f3ea]/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-[#2a2a2a] dark:bg-[#141414]/80",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#ffe1cc] text-[#ff4b12] dark:bg-[#3a3d10] dark:text-[#d7ff00]">
                        <FileTypeIcon fileType={file.file_type} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
                          {file.title}
                        </p>
                        <p className="text-xs font-semibold tracking-[0.08em] text-zinc-500 uppercase dark:text-zinc-400">
                          {accountPageContent.fileTypes[file.file_type]}
                        </p>
                      </div>
                    </div>

                    <CourseFileDownloadButton
                      courseId={course.id}
                      fileId={file.id}
                      className="w-full sm:w-auto"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
