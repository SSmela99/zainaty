import type { Testimonial } from "@/lib/testimonials/types";
import { createPublicClient } from "@/lib/supabase/public";

function mapTestimonial(row: Record<string, unknown>): Testimonial {
  return {
    id: row.id as string,
    author_name: row.author_name as string,
    author_role: row.author_role as string,
    content: row.content as string,
    rating: row.rating as number,
    avatar_url: (row.avatar_url as string | null) ?? null,
    sort_order: row.sort_order as number,
    published: row.published as boolean,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function getPublishedTestimonials(): Promise<Testimonial[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .order("sort_order")
    .order("created_at");

  if (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[getPublishedTestimonials]", error.message);
    }

    return [];
  }

  return (data ?? []).map(mapTestimonial);
}
