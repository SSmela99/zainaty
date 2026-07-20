import { cache } from "react";
import { unstable_cache } from "next/cache";

import type { CourseKind } from "@/lib/courses/kinds";
import type { Course, CoursePackageItem } from "@/lib/courses/types";
import { createPublicClient } from "@/lib/supabase/public";

function toNumber(value: unknown): number {
  return typeof value === "number" ? value : Number(value);
}

function mapCourse(row: Record<string, unknown>): Course {
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
    files: [],
    curriculum: [],
    package_items: [],
  };
}

function mapPackageItem(row: Record<string, unknown>): CoursePackageItem {
  return {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    kind: (row.kind as CourseKind | undefined) ?? "training",
    cover_image_url: (row.cover_image_url as string | null) ?? null,
  };
}

export async function getPublishedCoursesByKind(
  kind: CourseKind,
): Promise<Course[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("published", true)
    .eq("kind", kind)
    .order("sort_order")
    .order("created_at", { ascending: false });

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(`[getPublishedCoursesByKind:${kind}]`, error.message);
    }

    return [];
  }

  if (!data) return [];
  return data.map(mapCourse);
}

export async function getPublishedCourses(): Promise<Course[]> {
  return getPublishedCoursesByKind("training");
}

async function fetchFeaturedCourses(): Promise<Course[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("published", true)
    .eq("is_featured", true)
    .in("kind", ["training", "video"])
    .order("sort_order")
    .order("created_at", { ascending: false });

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[getFeaturedCourses]", error.message);
    }

    return [];
  }

  if (!data) return [];
  return data.map(mapCourse);
}

export const getFeaturedCourses = unstable_cache(
  fetchFeaturedCourses,
  ["featured-courses"],
  { revalidate: 60, tags: ["home-courses"] },
);

export const getPublishedCourseBySlug = cache(
  async (slug: string): Promise<Course | null> => {
    const supabase = createPublicClient();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();

    if (error || !data) return null;

    const course = mapCourse(data);

    if (course.kind === "package") {
      course.package_items = await getPackageItems(supabase, course.id);
    }

    return course;
  },
);

export async function getPublishedCourseSlugs(): Promise<
  Array<{ slug: string; updated_at: string }>
> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("courses")
    .select("slug, updated_at")
    .eq("published", true)
    .order("sort_order");

  if (error || !data) return [];

  return data.map((row) => ({
    slug: row.slug as string,
    updated_at: row.updated_at as string,
  }));
}

async function getPackageItems(
  supabase: NonNullable<ReturnType<typeof createPublicClient>>,
  packageId: string,
): Promise<CoursePackageItem[]> {
  const { data, error } = await supabase
    .from("course_package_items")
    .select(
      "sort_order, course:courses!course_package_items_course_id_fkey(id, title, slug, kind, cover_image_url, published)",
    )
    .eq("package_id", packageId)
    .order("sort_order");

  if (error || !data) return [];

  return (data as unknown as Array<{ course: unknown }>).flatMap((row) => {
    const course = (
      Array.isArray(row.course) ? row.course[0] : row.course
    ) as Record<string, unknown> | null | undefined;

    if (!course || course.published !== true) return [];
    return [mapPackageItem(course)];
  });
}
