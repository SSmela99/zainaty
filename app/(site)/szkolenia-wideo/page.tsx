import type { Metadata } from "next";

import { CoursesGrid, CoursesHero } from "@/components/courses";
import { coursesSectionContent } from "@/components/courses/courses-section.utils";
import { getPublishedCoursesByKind } from "@/lib/courses/queries";

const content = coursesSectionContent.video;

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
};

export default async function VideoTrainingsPage() {
  const courses = await getPublishedCoursesByKind("video");

  return (
    <div className="mx-auto max-w-350 px-8 pb-20 md:pb-28">
      <CoursesHero title={content.title} description={content.description} />
      <CoursesGrid courses={courses} emptyMessage={content.empty} />
    </div>
  );
}
