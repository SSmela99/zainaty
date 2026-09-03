import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CourseDetailView } from "@/components/courses";
import { JsonLd } from "@/components/seo/json-ld";
import { userOwnsCourse } from "@/lib/courses/access";
import {
  getPublishedCourseBySlug,
  getPublishedCourseSlugs,
} from "@/lib/courses/queries";
import { PATHS, courseListPathByKind, coursePath } from "@/lib/paths";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata, truncateDescription } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";

type CoursePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const courses = await getPublishedCourseSlugs();
  return courses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getPublishedCourseBySlug(slug);

  if (!course) {
    return { title: "Kurs nie znaleziony" };
  }

  return buildPageMetadata({
    title: course.title,
    description: truncateDescription(course.description),
    path: coursePath(course.slug),
    image: course.cover_image_url,
  });
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

  const listPath = courseListPathByKind(course.kind);
  const listLabel =
    course.kind === "video"
      ? "Szkolenia wideo"
      : course.kind === "package"
        ? "Pakiety szkoleń"
        : "Szkolenia";

  return (
    <>
      <JsonLd
        data={[
          courseJsonLd(course),
          breadcrumbJsonLd([
            { name: "Strona główna", path: PATHS.HOME },
            { name: listLabel, path: listPath },
            { name: course.title, path: coursePath(course.slug) },
          ]),
        ]}
      />
      <CourseDetailView course={course} hasAccess={hasAccess} />
    </>
  );
}
