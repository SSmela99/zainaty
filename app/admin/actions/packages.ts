"use server";

import { revalidatePath } from "next/cache";

import { slugify } from "@/lib/blog/slug";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { CourseKind } from "@/lib/courses/kinds";
import type {
  Course,
  CourseActionResult,
  CourseOption,
  CoursePackageItem,
  PackageFormInput,
} from "@/lib/courses/types";
import { createClient } from "@/lib/supabase/server";

function toNumber(value: unknown): number {
  return typeof value === "number" ? value : Number(value);
}

const PACKAGE_SELECT = `
  *,
  course_package_items!course_package_items_package_id_fkey(
    sort_order,
    course:courses!course_package_items_course_id_fkey(
      id, title, slug, kind, cover_image_url
    )
  )
`;

function mapPackage(row: Record<string, unknown>): Course {
  const itemRows =
    (row.course_package_items as
      | Array<{ sort_order: number; course: Record<string, unknown> | null }>
      | null) ?? [];

  const packageItems: CoursePackageItem[] = itemRows
    .slice()
    .sort((left, right) => left.sort_order - right.sort_order)
    .flatMap((entry) => {
      const course = (
        Array.isArray(entry.course) ? entry.course[0] : entry.course
      ) as Record<string, unknown> | null | undefined;

      if (!course) return [];

      return [
        {
          id: course.id as string,
          title: course.title as string,
          slug: course.slug as string,
          kind: (course.kind as CourseKind | undefined) ?? "training",
          cover_image_url: (course.cover_image_url as string | null) ?? null,
        },
      ];
    });

  return {
    id: row.id as string,
    kind: "package",
    title: row.title as string,
    slug: row.slug as string,
    description: row.description as string,
    description_secondary: (row.description_secondary as string | null) ?? "",
    demo_youtube_url: (row.demo_youtube_url as string | null) ?? null,
    cover_image_url: (row.cover_image_url as string | null) ?? null,
    price: toNumber(row.price),
    discount_price:
      row.discount_price == null ? null : toNumber(row.discount_price),
    target_audience: (row.target_audience as string | null) ?? "",
    learning_points: (row.learning_points as string[] | null) ?? [],
    outcomes: (row.outcomes as string[] | null) ?? [],
    duration_label: (row.duration_label as string | null) ?? "",
    format_label: (row.format_label as string | null) ?? "Pakiet szkoleń",
    published: row.published as boolean,
    is_featured: false,
    sort_order: row.sort_order as number,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    files: [],
    package_items: packageItems,
  };
}

function buildPackagePayload(input: PackageFormInput) {
  return {
    kind: "package" as const,
    title: input.title.trim(),
    slug: slugify(input.slug || input.title),
    description: input.description.trim(),
    description_secondary: input.description_secondary.trim(),
    cover_image_url: input.cover_image_url,
    price: input.price,
    discount_price:
      input.discount_price == null || Number.isNaN(input.discount_price)
        ? null
        : input.discount_price,
    published: input.published,
    is_featured: false,
    format_label: "Pakiet szkoleń",
  };
}

async function syncPackageItems(
  supabase: Awaited<ReturnType<typeof createClient>>,
  packageId: string,
  courseIds: string[],
) {
  const uniqueIds = [
    ...new Set(courseIds.filter((courseId) => courseId !== packageId)),
  ];

  const { error: deleteError } = await supabase
    .from("course_package_items")
    .delete()
    .eq("package_id", packageId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (uniqueIds.length === 0) {
    return;
  }

  const { error: insertError } = await supabase
    .from("course_package_items")
    .insert(
      uniqueIds.map((course_id, index) => ({
        package_id: packageId,
        course_id,
        sort_order: index,
      })),
    );

  if (insertError) {
    throw new Error(insertError.message);
  }
}

function revalidatePackagePaths() {
  revalidatePath("/admin");
  revalidatePath("/pakiety-szkolen");
  revalidatePath("/szkolenia", "layout");
  revalidatePath("/");
}

export async function listPackages(): Promise<CourseActionResult<Course[]>> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("courses")
      .select(PACKAGE_SELECT)
      .eq("kind", "package")
      .order("sort_order")
      .order("created_at", { ascending: false });

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []).map(mapPackage) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function listCoursesForPackage(): Promise<
  CourseActionResult<CourseOption[]>
> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("courses")
      .select("id, title, slug, kind, published")
      .in("kind", ["training", "video"])
      .order("kind")
      .order("title");

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []) as CourseOption[] };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function createPackage(
  input: PackageFormInput,
): Promise<CourseActionResult<Course>> {
  try {
    const supabase = await requireAdmin();
    const payload = buildPackagePayload(input);

    if (!payload.slug) {
      return { ok: false, error: "Podaj nazwę pakietu." };
    }

    const { data: lastPackage, error: lastError } = await supabase
      .from("courses")
      .select("sort_order")
      .eq("kind", "package")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastError) return { ok: false, error: lastError.message };

    const sort_order = (lastPackage?.sort_order ?? -1) + 1;

    const { data, error } = await supabase
      .from("courses")
      .insert({ ...payload, sort_order })
      .select("id")
      .single();

    if (error) return { ok: false, error: error.message };

    try {
      await syncPackageItems(supabase, data.id, input.course_ids);
    } catch (syncError) {
      await supabase.from("courses").delete().eq("id", data.id);
      return {
        ok: false,
        error:
          syncError instanceof Error
            ? syncError.message
            : "Nie udało się zapisać kursów pakietu.",
      };
    }

    const { data: fullPackage, error: fetchError } = await supabase
      .from("courses")
      .select(PACKAGE_SELECT)
      .eq("id", data.id)
      .single();

    if (fetchError) return { ok: false, error: fetchError.message };

    revalidatePackagePaths();
    return { ok: true, data: mapPackage(fullPackage) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function updatePackage(
  id: string,
  input: PackageFormInput,
): Promise<CourseActionResult<Course>> {
  try {
    const supabase = await requireAdmin();
    const payload = buildPackagePayload(input);

    if (!payload.slug) {
      return { ok: false, error: "Podaj nazwę pakietu." };
    }

    const { error } = await supabase
      .from("courses")
      .update(payload)
      .eq("id", id);

    if (error) return { ok: false, error: error.message };

    try {
      await syncPackageItems(supabase, id, input.course_ids);
    } catch (syncError) {
      return {
        ok: false,
        error:
          syncError instanceof Error
            ? syncError.message
            : "Nie udało się zapisać kursów pakietu.",
      };
    }

    const { data: fullPackage, error: fetchError } = await supabase
      .from("courses")
      .select(PACKAGE_SELECT)
      .eq("id", id)
      .single();

    if (fetchError) return { ok: false, error: fetchError.message };

    revalidatePackagePaths();
    return { ok: true, data: mapPackage(fullPackage) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function deletePackage(id: string): Promise<CourseActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("courses").delete().eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidatePackagePaths();
    return { ok: true };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}
