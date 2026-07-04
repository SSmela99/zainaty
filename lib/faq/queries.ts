import type { FaqItem } from "@/lib/faq/types";
import { createPublicClient } from "@/lib/supabase/public";

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

export async function getPublishedFaqItems(): Promise<FaqItem[]> {
  const supabase = createPublicClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .eq("published", true)
    .order("sort_order")
    .order("created_at");

  if (error) {
    console.error("getPublishedFaqItems:", error.message);
    return [];
  }

  return (data ?? []).map(mapFaqItem);
}
