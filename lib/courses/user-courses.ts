import "server-only";

import { cache } from "react";

import {
  buildCurriculumTree,
  type CurriculumNodeKind,
} from "@/lib/courses/curriculum";
import type { CourseKind } from "@/lib/courses/kinds";
import type { CourseFileType } from "@/lib/courses/types";
import {
  flattenPlayableLessons,
  type UserAccessibleCourse,
  type UserAccessibleCourseFile,
  type UserCurriculumNode,
} from "@/lib/courses/user-courses.shared";
import { createClient } from "@/lib/supabase/server";

export type {
  UserAccessibleCourse,
  UserAccessibleCourseFile,
  UserCurriculumNode,
};

export { flattenPlayableLessons };

type CourseFileRow = {
  id: string;
  title: string;
  file_type: string;
  sort_order: number;
  r2_object_key: string;
};

type CurriculumNodeRow = {
  id: string;
  course_id: string;
  parent_id: string | null;
  kind: CurriculumNodeKind;
  title: string;
  description: string;
  sort_order: number;
  r2_object_key: string | null;
  created_at: string;
};

type CourseRow = {
  id: string;
  title: string;
  slug: string;
  kind: string;
  files: CourseFileRow[] | null;
  curriculum_nodes: CurriculumNodeRow[] | null;
};

type PurchaseRow = {
  purchased_at: string;
  course: CourseRow | CourseRow[] | null;
};

const COURSE_SELECT = `
  id,
  title,
  slug,
  kind,
  files:course_files (
    id,
    title,
    file_type,
    sort_order,
    r2_object_key
  ),
  curriculum_nodes:course_curriculum_nodes (
    id,
    course_id,
    parent_id,
    kind,
    title,
    description,
    sort_order,
    r2_object_key,
    created_at
  )
`;

function normalizeCourse(
  course: CourseRow | CourseRow[] | null,
): CourseRow | null {
  if (!course) return null;
  return Array.isArray(course) ? (course[0] ?? null) : course;
}

function mapCourseFiles(files: CourseFileRow[] | null): UserAccessibleCourseFile[] {
  return (files ?? [])
    .slice()
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((file) => ({
      id: file.id,
      title: file.title,
      file_type: file.file_type as CourseFileType,
    }));
}

function flattenLessonNodesFromTree(
  nodes: ReturnType<typeof buildCurriculumTree>,
): ReturnType<typeof buildCurriculumTree> {
  const lessons: ReturnType<typeof buildCurriculumTree> = [];

  function walk(items: ReturnType<typeof buildCurriculumTree>) {
    for (const item of items) {
      if (item.kind === "lesson") {
        lessons.push(item);
      }

      if (item.children.length > 0) {
        walk(item.children);
      }
    }
  }

  walk(nodes);
  return lessons;
}

function mapUserCurriculum(
  nodes: CurriculumNodeRow[] | null,
  files: CourseFileRow[] | null,
): UserCurriculumNode[] {
  const sortedFiles = (files ?? [])
    .slice()
    .sort((left, right) => left.sort_order - right.sort_order);
  const fileIdByTitle = new Map(
    sortedFiles.map((file) => [file.title.trim(), file.id]),
  );

  const tree = buildCurriculumTree(nodes ?? []);
  const flatLessons = flattenLessonNodesFromTree(tree);
  const fileIdByLessonId = new Map<string, string>();

  flatLessons.forEach((lesson, index) => {
    const byTitle = fileIdByTitle.get(lesson.title.trim());
    const byOrder = sortedFiles[index]?.id;
    const fileId = byTitle ?? byOrder;

    if (fileId) {
      fileIdByLessonId.set(lesson.id, fileId);
    }
  });

  function mapNode(node: (typeof tree)[number]): UserCurriculumNode {
    return {
      id: node.id,
      kind: node.kind,
      title: node.title,
      description:
        node.kind === "lesson" && node.description.trim()
          ? node.description.trim()
          : null,
      fileId:
        node.kind === "lesson"
          ? (fileIdByLessonId.get(node.id) ?? null)
          : null,
      children: node.children.map(mapNode),
    };
  }

  return tree.map(mapNode);
}

function mapPurchaseRow(row: PurchaseRow): UserAccessibleCourse | null {
  const course = normalizeCourse(row.course);
  if (!course || course.kind === "package") {
    return null;
  }

  const kind = course.kind as CourseKind;
  const files = mapCourseFiles(course.files);

  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    kind,
    purchased_at: row.purchased_at,
    files,
    curriculum:
      kind === "video"
        ? mapUserCurriculum(course.curriculum_nodes, course.files)
        : [],
  };
}

export async function listUserAccessibleCourses(): Promise<UserAccessibleCourse[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("course_purchases")
    .select(
      `
      purchased_at,
      course:courses (
        ${COURSE_SELECT}
      )
    `,
    )
    .eq("user_id", user.id)
    .order("purchased_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as PurchaseRow[])
    .map(mapPurchaseRow)
    .filter((course): course is UserAccessibleCourse => course !== null);
}

export const getUserAccessibleCourseBySlug = cache(
  async (slug: string): Promise<UserAccessibleCourse | null> => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from("course_purchases")
      .select(
        `
      purchased_at,
      course:courses!inner (
        ${COURSE_SELECT}
      )
    `,
      )
      .eq("user_id", user.id)
      .eq("course.slug", slug)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const course = mapPurchaseRow(data as PurchaseRow);

    if (!course || course.kind !== "video") {
      return null;
    }

    return course;
  },
);
