import type { Metadata } from "next";

import { CoursesGrid, CoursesHero } from "@/components/courses";
import { coursesSectionContent } from "@/components/courses/courses-section.utils";
import { getPublishedCoursesByKind } from "@/lib/courses/queries";
import { PATHS } from "@/lib/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

const content = coursesSectionContent.packages;

export const metadata: Metadata = buildPageMetadata({
  title: content.title,
  description: content.description,
  path: PATHS.COURSES_PACKAGES,
});

export default async function TrainingPackagesPage() {
  const courses = await getPublishedCoursesByKind("package");

  return (
    <div className="mx-auto max-w-350 px-8 pb-20 md:pb-28">
      <CoursesHero title={content.title} description={content.description} />
      <CoursesGrid courses={courses} emptyMessage={content.empty} />
    </div>
  );
}
