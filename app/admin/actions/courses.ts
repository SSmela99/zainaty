"use server";

import { revalidatePath } from "next/cache";

import { slugify } from "@/lib/blog/slug";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { CourseKind } from "@/lib/courses/kinds";
import type {
  Course,
  CourseActionResult,
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

function mapCourse(row: Record<string, unknown>): Course {
  const fileRows =
    (row.course_files as Array<Record<string, unknown>> | null) ?? [];

  return {
    id: row.id as string,
    kind: (row.kind as CourseKind | undefined) ?? "training",
    title: row.title as string,
    slug: row.slug as string,
    description: row.description as string,
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
    sort_order: row.sort_order as number,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    files: fileRows
      .map(mapCourseFile)
      .sort((left, right) => left.sort_order - right.sort_order),
  };
}

function sanitizeInput(input: CourseFormInput): CourseFormInput {
  return {
    ...input,
    slug: slugify(input.slug || input.title),
    is_featured: input.kind === "package" ? false : input.is_featured,
    learning_points: normalizeStringList(input.learning_points),
    outcomes: normalizeStringList(input.outcomes),
    files: input.files.map((file) => ({
      file_type: file.file_type,
      title: file.title.trim(),
      r2_object_key: file.r2_object_key.trim(),
    })),
    discount_price:
      input.discount_price == null || Number.isNaN(input.discount_price)
        ? null
        : input.discount_price,
    demo_youtube_url: input.demo_youtube_url?.trim() || null,
  };
}

const COURSE_SELECT = `
  *,
  course_files (*)
`;

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
    const { files, ...coursePayload } = sanitizeInput(input);

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
    const { files, ...coursePayload } = sanitizeInput(input);

    const { error } = await supabase
      .from("courses")
      .update(coursePayload)
      .eq("id", id);

    if (error) return { ok: false, error: error.message };

    try {
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
