"use client";

import {
  ChevronDownIcon,
  FileTextIcon,
  PlayCircleIcon,
  VideoIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { UserAccessibleCourse } from "@/lib/courses/user-courses.shared";
import { accountVideoCoursePath } from "@/lib/paths";
import { cn } from "@/lib/utils";

import { accountPageContent } from "./account-page.utils";
import { CourseFileDownloadButton } from "./course-file-download-button";

type AccountCourseRowProps = {
  course: UserAccessibleCourse;
  purchasedAtLabel: string;
};

function FileTypeIcon({ fileType }: { fileType: "pdf" | "video" }) {
  if (fileType === "video") {
    return <VideoIcon className="size-4 shrink-0" strokeWidth={2.2} />;
  }

  return <FileTextIcon className="size-4 shrink-0" strokeWidth={2.2} />;
}

export function AccountCourseRow({
  course,
  purchasedAtLabel,
}: AccountCourseRowProps) {
  const content = accountPageContent.courses;
  const isVideo = course.kind === "video";
  const [isOpen, setIsOpen] = useState(false);

  if (isVideo) {
    return (
      <article className="rounded-3xl border border-[#ddd8ce] bg-white px-5 py-5 dark:border-[#282828] dark:bg-[#1c1c1c] md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-black tracking-[0.02em] text-zinc-950 dark:text-white md:text-xl">
              {course.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {content.purchasedAt}: {purchasedAtLabel}
            </p>
          </div>

          <Link
            href={accountVideoCoursePath(course.slug)}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#f24a00] px-5 text-sm font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-[1.02] dark:bg-[#daff02] dark:text-zinc-950"
          >
            <PlayCircleIcon className="size-5" strokeWidth={2.2} />
            {content.openVideoCourse}
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article
      className={cn(
        "rounded-3xl border bg-white transition-[border-color,box-shadow] duration-300 dark:bg-[#1c1c1c]",
        isOpen
          ? "border-[#f24a00] shadow-[0_8px_32px_rgba(255,75,18,0.12)] dark:border-[#daff02] dark:shadow-none"
          : "border-[#ddd8ce] dark:border-[#282828]",
      )}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full cursor-pointer items-center gap-4 px-5 py-5 text-left md:px-6"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-black tracking-[0.02em] text-zinc-950 md:text-xl dark:text-white">
            {course.title}
          </span>
          <span className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400">
            {content.purchasedAt}: {purchasedAtLabel}
          </span>
        </span>

        <span
          aria-hidden
          className={cn(
            "inline-flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
            isOpen
              ? "bg-[#f24a00] text-white dark:bg-[#daff02] dark:text-zinc-950"
              : "bg-[#ffd0bc] text-[#f24a00] dark:bg-[#3a4500] dark:text-[#daff02]",
          )}
        >
          <ChevronDownIcon
            className={cn(
              "size-4 transition-transform duration-300",
              isOpen ? "rotate-180" : "rotate-0",
            )}
            strokeWidth={2.5}
          />
        </span>
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#ede8de] px-5 pb-5 md:px-6 md:pb-6 dark:border-[#2a2a2a]">
            {course.files.length === 0 ? (
              <p className="pt-4 text-sm text-zinc-600 dark:text-zinc-400">
                {content.noFiles}
              </p>
            ) : (
              <ul className="space-y-3 pt-4">
                {course.files.map((file) => (
                  <li
                    key={file.id}
                    className="flex flex-col gap-3 rounded-2xl border border-[#ede8de] bg-[#f5f2e9]/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-[#2a2a2a] dark:bg-[#151414]/80"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#ffd0bc] text-[#f24a00] dark:bg-[#3a4500] dark:text-[#daff02]">
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
        </div>
      </div>
    </article>
  );
}
