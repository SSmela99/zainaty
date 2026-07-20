"use server";

import { revalidatePath, updateTag } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import type {
  Testimonial,
  TestimonialActionResult,
  TestimonialFormInput,
} from "@/lib/testimonials/types";

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

function sanitizeInput(input: TestimonialFormInput): TestimonialFormInput {
  return {
    ...input,
    author_name: input.author_name.trim(),
    author_role: input.author_role.trim(),
    content: input.content.trim(),
    avatar_url: input.avatar_url?.trim() || null,
  };
}

function revalidateTestimonialPaths() {
  revalidatePath("/admin");
  revalidatePath("/");
  updateTag("home-testimonials");
}

export async function listTestimonials(): Promise<
  TestimonialActionResult<Testimonial[]>
> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order")
      .order("created_at");

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []).map(mapTestimonial) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function createTestimonial(
  input: TestimonialFormInput,
): Promise<TestimonialActionResult<Testimonial>> {
  try {
    const supabase = await requireAdmin();
    const payload = sanitizeInput(input);

    const { data: lastItem, error: lastError } = await supabase
      .from("testimonials")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastError) return { ok: false, error: lastError.message };

    const sort_order = (lastItem?.sort_order ?? -1) + 1;

    const { data, error } = await supabase
      .from("testimonials")
      .insert({ ...payload, sort_order })
      .select("*")
      .single();

    if (error) return { ok: false, error: error.message };

    revalidateTestimonialPaths();
    return { ok: true, data: mapTestimonial(data) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function updateTestimonial(
  id: string,
  input: TestimonialFormInput,
): Promise<TestimonialActionResult<Testimonial>> {
  try {
    const supabase = await requireAdmin();
    const payload = sanitizeInput(input);

    const { data, error } = await supabase
      .from("testimonials")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) return { ok: false, error: error.message };

    revalidateTestimonialPaths();
    return { ok: true, data: mapTestimonial(data) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function deleteTestimonial(id: string): Promise<TestimonialActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidateTestimonialPaths();
    return { ok: true };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function reorderTestimonials(
  orderedIds: string[],
): Promise<TestimonialActionResult> {
  try {
    if (orderedIds.length === 0) return { ok: true };

    const supabase = await requireAdmin();

    const results = await Promise.all(
      orderedIds.map((id, index) =>
        supabase.from("testimonials").update({ sort_order: index }).eq("id", id),
      ),
    );

    const failed = results.find((result) => result.error);
    if (failed?.error) return { ok: false, error: failed.error.message };

    revalidateTestimonialPaths();
    return { ok: true };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}
