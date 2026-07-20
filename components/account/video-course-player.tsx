"use client";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  flattenPlayableLessons,
  type UserAccessibleCourse,
} from "@/lib/courses/user-courses.shared";
import { PATHS } from "@/lib/paths";

import { accountPageContent } from "./account-page.utils";
import { VideoCourseSidebar } from "./video-course-sidebar";
import { VideoLessonPlayer } from "./video-lesson-player";

type VideoCoursePlayerProps = {
  course: UserAccessibleCourse;
};

export function VideoCoursePlayer({ course }: VideoCoursePlayerProps) {
  const content = accountPageContent.courses;
  const lessons = useMemo(
    () => flattenPlayableLessons(course.curriculum),
    [course.curriculum],
  );
  const [activeLesson, setActiveLesson] = useState(() => lessons[0] ?? null);

  function handleSelectLesson(lessonId: string, fileId: string) {
    const lesson = lessons.find((item) => item.id === lessonId);

    if (lesson) {
      setActiveLesson({ ...lesson, fileId });
    }
  }

  return (
    <section className="mx-auto w-full max-w-410 px-8 py-8 md:py-12">
      <Link
        href={PATHS.ACCOUNT}
        className="inline-flex items-center gap-2 text-sm font-bold text-zinc-600 transition-colors hover:text-[#f24a00] dark:text-zinc-400 dark:hover:text-[#daff02]"
      >
        <ArrowLeftIcon className="size-4" strokeWidth={2.2} />
        {content.backToCourses}
      </Link>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-2xl font-black tracking-[-0.03em] text-zinc-950 md:text-3xl dark:text-white">
          {course.title}
        </h1>
        {activeLesson ? (
          <>
            <span
              aria-hidden
              className="hidden text-2xl font-light text-zinc-300 md:inline dark:text-zinc-600"
            >
              /
            </span>
            <p className="text-lg font-bold tracking-[-0.02em] text-zinc-600 md:text-xl dark:text-zinc-300">
              {activeLesson.title}
            </p>
          </>
        ) : null}
      </div>

      {lessons.length === 0 ? (
        <p className="mt-8 text-sm text-zinc-600 dark:text-zinc-400">
          {content.videoPlayer.emptyCurriculum}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] lg:items-start">
          <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)]">
            <VideoCourseSidebar
              curriculum={course.curriculum}
              activeLessonId={activeLesson?.id ?? null}
              onSelectLesson={handleSelectLesson}
            />
          </div>

          <div className="min-w-0">
            {activeLesson?.fileId ? (
              <VideoLessonPlayer
                courseId={course.id}
                fileId={activeLesson.fileId}
                title={activeLesson.title}
                description={activeLesson.description}
              />
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {content.videoPlayer.selectLesson}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
