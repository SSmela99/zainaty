"use server";

import { revalidatePath } from "next/cache";

import type { FaqActionResult, FaqItem, FaqItemFormInput } from "@/lib/faq/types";
import { requireAdmin } from "@/lib/auth/require-admin";

function mapFaqItem(row: Record<string, unknown>): FaqItem {
  return {
    id: row.id as string,
    question: row.question as string,
    answer: row.answer as string,
    sort_order: row.sort_order as number,
    published: row.published as boolean,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function listFaqItems(): Promise<FaqActionResult<FaqItem[]>> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("faq_items")
      .select("*")
      .order("sort_order")
      .order("created_at");

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []).map(mapFaqItem) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function createFaqItem(
  input: FaqItemFormInput,
): Promise<FaqActionResult<FaqItem>> {
  try {
    const supabase = await requireAdmin();

    const { data: lastItem, error: lastError } = await supabase
      .from("faq_items")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastError) return { ok: false, error: lastError.message };

    const sort_order = (lastItem?.sort_order ?? -1) + 1;

    const { data, error } = await supabase
      .from("faq_items")
      .insert({ ...input, sort_order })
      .select("*")
      .single();

    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin");
    revalidatePath("/faq");
    return { ok: true, data: mapFaqItem(data) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function updateFaqItem(
  id: string,
  input: FaqItemFormInput,
): Promise<FaqActionResult<FaqItem>> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("faq_items")
      .update(input)
      .eq("id", id)
      .select("*")
      .single();

    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin");
    revalidatePath("/faq");
    return { ok: true, data: mapFaqItem(data) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function deleteFaqItem(id: string): Promise<FaqActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("faq_items").delete().eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin");
    revalidatePath("/faq");
    return { ok: true };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function reorderFaqItems(
  orderedIds: string[],
): Promise<FaqActionResult> {
  try {
    if (orderedIds.length === 0) return { ok: true };

    const supabase = await requireAdmin();

    const results = await Promise.all(
      orderedIds.map((id, index) =>
        supabase.from("faq_items").update({ sort_order: index }).eq("id", id),
      ),
    );

    const failed = results.find((result) => result.error);
    if (failed?.error) return { ok: false, error: failed.error.message };

    revalidatePath("/admin");
    revalidatePath("/faq");
    return { ok: true };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}
