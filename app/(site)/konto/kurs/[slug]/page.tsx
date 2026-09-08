import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { VideoCoursePlayer } from "@/components/account/video-course-player";
import { requireUser } from "@/lib/auth/session";
import { getUserAccessibleCourseBySlug } from "@/lib/courses/user-courses";
import { NO_INDEX_ROBOTS } from "@/lib/seo/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getUserAccessibleCourseBySlug(slug);

  return {
    title: course ? `${course.title} - odtwarzacz` : "Szkolenie wideo",
    description: course
      ? `Oglądaj szkolenie wideo: ${course.title}`
      : "Szkolenie wideo",
    robots: NO_INDEX_ROBOTS,
  };
}

export default async function AccountVideoCoursePage({ params }: PageProps) {
  await requireUser();
  const { slug } = await params;
  const course = await getUserAccessibleCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  return <VideoCoursePlayer course={course} />;
}
