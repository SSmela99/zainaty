"use server";

import { revalidatePath, updateTag } from "next/cache";

import { slugify } from "@/lib/blog/slug";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  buildCurriculumTree,
  flattenCurriculumLessons,
  type CurriculumNode,
  type CurriculumNodeInput,
} from "@/lib/courses/curriculum";
import type { CourseKind } from "@/lib/courses/kinds";
import type {
  Course,
  CourseActionResult,
  CourseCurriculumInput,
  CourseFile,
  CourseFileInput,
  CourseFormInput,
} from "@/lib/courses/types";
import { createClient } from "@/lib/supabase/server";

function toNumber(value: unknown): number {
  return typeof value === "number" ? value : Number(value);
}

function normalizeStringList(items: string[]): string[] {
  return items.map((item) => item.trim()).filter(Boolean);
}

function mapCourseFile(row: Record<string, unknown>): CourseFile {
  return {
    id: row.id as string,
    course_id: row.course_id as string,
    file_type: row.file_type as CourseFile["file_type"],
    title: row.title as string,
    r2_object_key: row.r2_object_key as string,
    sort_order: row.sort_order as number,
    created_at: row.created_at as string,
  };
}

function mapCurriculumNode(row: Record<string, unknown>): CurriculumNode {
  return {
    id: row.id as string,
    course_id: row.course_id as string,
    parent_id: (row.parent_id as string | null) ?? null,
    kind: row.kind as CurriculumNode["kind"],
    title: row.title as string,
    description: (row.description as string | undefined) ?? "",
    sort_order: row.sort_order as number,
    r2_object_key: (row.r2_object_key as string | null) ?? null,
    created_at: row.created_at as string,
    children: [],
  };
}

function mapCourse(row: Record<string, unknown>): Course {
  const fileRows =
    (row.course_files as Array<Record<string, unknown>> | null) ?? [];
  const curriculumRows =
    (row.course_curriculum_nodes as Array<Record<string, unknown>> | null) ??
    [];

  const flatCurriculum = curriculumRows.map(mapCurriculumNode);

  return {
    id: row.id as string,
    kind: (row.kind as CourseKind | undefined) ?? "training",
    title: row.title as string,
    slug: row.slug as string,
    description: row.description as string,
    description_secondary: (row.description_secondary as string | null) ?? "",
    demo_youtube_url: (row.demo_youtube_url as string | null) ?? null,
    cover_image_url: (row.cover_image_url as string | null) ?? null,
    price: toNumber(row.price),
    discount_price:
      row.discount_price == null ? null : toNumber(row.discount_price),
    target_audience: row.target_audience as string,
    learning_points: (row.learning_points as string[] | null) ?? [],
    outcomes: (row.outcomes as string[] | null) ?? [],
    duration_label: row.duration_label as string,
    format_label: row.format_label as string,
    published: row.published as boolean,
    is_featured: (row.is_featured as boolean | undefined) ?? false,
    show_in_news: (row.show_in_news as boolean | undefined) ?? false,
    sort_order: row.sort_order as number,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    files: fileRows
      .map(mapCourseFile)
      .sort((left, right) => left.sort_order - right.sort_order),
    curriculum: buildCurriculumTree(
      flatCurriculum.map((node) => ({
        id: node.id,
        course_id: node.course_id,
        parent_id: node.parent_id,
        kind: node.kind,
        title: node.title,
        description: node.description,
        sort_order: node.sort_order,
        r2_object_key: node.r2_object_key,
        created_at: node.created_at,
      })),
    ),
    package_items: [],
  };
}

function sanitizeInput(input: CourseFormInput): CourseFormInput {
  const isVideo = input.kind === "video";
  const lessons = isVideo
    ? flattenCurriculumLessons(input.curriculum).map((lesson) => ({
        file_type: "video" as const,
        title: lesson.title,
        r2_object_key: lesson.r2_object_key,
      }))
    : input.files.map((file) => ({
        file_type: file.file_type,
        title: file.title.trim(),
        r2_object_key: file.r2_object_key.trim(),
      }));

  return {
    ...input,
    slug: slugify(input.slug || input.title),
    is_featured: input.kind === "package" ? false : input.is_featured,
    learning_points: normalizeStringList(input.learning_points),
    outcomes: normalizeStringList(input.outcomes),
    files: lessons,
    curriculum: isVideo
      ? input.curriculum.map(sanitizeCurriculumNode)
      : [],
    discount_price:
      input.discount_price == null || Number.isNaN(input.discount_price)
        ? null
        : input.discount_price,
    demo_youtube_url:
      input.kind === "training"
        ? null
        : input.demo_youtube_url?.trim() || null,
  };
}

function sanitizeCurriculumNode(
  node: CourseCurriculumInput,
): CourseCurriculumInput {
  return {
    kind: node.kind,
    title: node.title.trim(),
    description:
      node.kind === "lesson" ? node.description?.trim() || null : null,
    r2_object_key:
      node.kind === "lesson" ? node.r2_object_key?.trim() || null : null,
    children: node.children.map(sanitizeCurriculumNode),
  };
}

const COURSE_SELECT = `
  *,
  course_files (*),
  course_curriculum_nodes (*)
`;

async function insertCurriculumNodes(
  supabase: Awaited<ReturnType<typeof createClient>>,
  courseId: string,
  nodes: CurriculumNodeInput[],
  parentId: string | null = null,
): Promise<void> {
  for (const [index, node] of nodes.entries()) {
    const { data, error } = await supabase
      .from("course_curriculum_nodes")
      .insert({
        course_id: courseId,
        parent_id: parentId,
        kind: node.kind,
        title: node.title,
        description: node.description ?? "",
        sort_order: index,
        r2_object_key: node.r2_object_key,
      })
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "Nie udało się zapisać programu kursu.");
    }

    if (node.children.length > 0) {
      await insertCurriculumNodes(
        supabase,
        courseId,
        node.children,
        data.id as string,
      );
    }
  }
}

async function syncCurriculumNodes(
  supabase: Awaited<ReturnType<typeof createClient>>,
  courseId: string,
  curriculum: CurriculumNodeInput[],
) {
  const { error: deleteError } = await supabase
    .from("course_curriculum_nodes")
    .delete()
    .eq("course_id", courseId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (curriculum.length === 0) {
    return;
  }

  await insertCurriculumNodes(supabase, courseId, curriculum);
}

async function syncCourseFiles(
  supabase: Awaited<ReturnType<typeof createClient>>,
  courseId: string,
  files: CourseFileInput[],
) {
  const { error: deleteError } = await supabase
    .from("course_files")
    .delete()
    .eq("course_id", courseId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (files.length === 0) {
    return;
  }

  const { error: insertError } = await supabase.from("course_files").insert(
    files.map((file, index) => ({
      course_id: courseId,
      file_type: file.file_type,
      title: file.title,
      r2_object_key: file.r2_object_key,
      sort_order: index,
    })),
  );

  if (insertError) {
    throw new Error(insertError.message);
  }
}

function revalidateCoursePaths() {
  revalidatePath("/admin");
  revalidatePath("/szkolenia", "layout");
  revalidatePath("/szkolenia-wideo");
  revalidatePath("/pakiety-szkolen");
  revalidatePath("/");
  updateTag("home-courses");
  updateTag("home-news");
}

export async function listCourses(
  kind?: CourseKind,
): Promise<CourseActionResult<Course[]>> {
  try {
    const supabase = await requireAdmin();
    let query = supabase
      .from("courses")
      .select(COURSE_SELECT)
      .order("sort_order")
      .order("created_at", { ascending: false });

    if (kind) {
      query = query.eq("kind", kind);
    }

    const { data, error } = await query;

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []).map(mapCourse) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function createCourse(
  input: CourseFormInput,
): Promise<CourseActionResult<Course>> {
  try {
    const supabase = await requireAdmin();
    const { files, curriculum, ...coursePayload } = sanitizeInput(input);

    const { data: lastCourse, error: lastError } = await supabase
      .from("courses")
      .select("sort_order")
      .eq("kind", coursePayload.kind)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastError) return { ok: false, error: lastError.message };

    const sort_order = (lastCourse?.sort_order ?? -1) + 1;

    const { data, error } = await supabase
      .from("courses")
      .insert({ ...coursePayload, sort_order })
      .select("*")
      .single();

    if (error) return { ok: false, error: error.message };

    try {
      if (coursePayload.kind === "video") {
        await syncCurriculumNodes(supabase, data.id, curriculum);
      }
      await syncCourseFiles(supabase, data.id, files);
    } catch (syncError) {
      await supabase.from("courses").delete().eq("id", data.id);
      return {
        ok: false,
        error:
          syncError instanceof Error
            ? syncError.message
            : "Nie udało się zapisać plików kursu.",
      };
    }

    const { data: fullCourse, error: fetchError } = await supabase
      .from("courses")
      .select(COURSE_SELECT)
      .eq("id", data.id)
      .single();

    if (fetchError) return { ok: false, error: fetchError.message };

    revalidateCoursePaths();
    return { ok: true, data: mapCourse(fullCourse) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function updateCourse(
  id: string,
  input: CourseFormInput,
): Promise<CourseActionResult<Course>> {
  try {
    const supabase = await requireAdmin();
    const { files, curriculum, ...coursePayload } = sanitizeInput(input);

    const { error } = await supabase
      .from("courses")
      .update(coursePayload)
      .eq("id", id);

    if (error) return { ok: false, error: error.message };

    try {
      if (coursePayload.kind === "video") {
        await syncCurriculumNodes(supabase, id, curriculum);
      } else {
        await syncCurriculumNodes(supabase, id, []);
      }
      await syncCourseFiles(supabase, id, files);
    } catch (syncError) {
      return {
        ok: false,
        error:
          syncError instanceof Error
            ? syncError.message
            : "Nie udało się zapisać plików kursu.",
      };
    }

    const { data: fullCourse, error: fetchError } = await supabase
      .from("courses")
      .select(COURSE_SELECT)
      .eq("id", id)
      .single();

    if (fetchError) return { ok: false, error: fetchError.message };

    revalidateCoursePaths();
    return { ok: true, data: mapCourse(fullCourse) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function deleteCourse(id: string): Promise<CourseActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("courses").delete().eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidateCoursePaths();
    return { ok: true };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}
