import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CourseDetailView } from "@/components/courses";
import { userOwnsCourse } from "@/lib/courses/access";
import { getPublishedCourseBySlug } from "@/lib/courses/queries";
import { createClient } from "@/lib/supabase/server";

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getPublishedCourseBySlug(slug);

  if (!course) {
    return { title: "Kurs nie znaleziony" };
  }

  return {
    title: course.title,
    description: course.description.slice(0, 160),
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await getPublishedCourseBySlug(slug);

  if (!course) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasAccess = false;

  if (user) {
    hasAccess = await userOwnsCourse(supabase, user.id, course.id);
  }

  return <CourseDetailView course={course} hasAccess={hasAccess} />;
}
