import type { CourseKind } from "@/lib/courses/kinds";
import type { Course } from "@/lib/courses/types";
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
    files: [],
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

export async function getFeaturedCourses(): Promise<Course[]> {
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

export async function getPublishedCourseBySlug(
  slug: string,
): Promise<Course | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error || !data) return null;
  return mapCourse(data);
}
