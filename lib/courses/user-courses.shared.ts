import type { CurriculumNodeKind } from "@/lib/courses/curriculum";
import type { CourseKind } from "@/lib/courses/kinds";
import type { CourseFileType } from "@/lib/courses/types";

export type UserAccessibleCourseFile = {
  id: string;
  title: string;
  file_type: CourseFileType;
};

export type UserCurriculumNode = {
  id: string;
  kind: CurriculumNodeKind;
  title: string;
  description: string | null;
  fileId: string | null;
  children: UserCurriculumNode[];
};

export type UserAccessibleCourse = {
  id: string;
  title: string;
  slug: string;
  kind: CourseKind;
  purchased_at: string;
  files: UserAccessibleCourseFile[];
  curriculum: UserCurriculumNode[];
};

export function flattenPlayableLessons(
  nodes: UserCurriculumNode[],
): Array<UserCurriculumNode & { fileId: string }> {
  const lessons: Array<UserCurriculumNode & { fileId: string }> = [];

  function walk(items: UserCurriculumNode[]) {
    for (const item of items) {
      if (item.kind === "lesson" && item.fileId) {
        lessons.push({ ...item, fileId: item.fileId });
      }

      if (item.children.length > 0) {
        walk(item.children);
      }
    }
  }

  walk(nodes);
  return lessons;
}
