import type { SupabaseClient } from "@supabase/supabase-js";

import { getCourseEffectivePrice } from "@/lib/checkout/pricing";
import { createAdminClient } from "@/lib/supabase/admin";

type HistoryRow = {
  effective_price: number | string;
  recorded_at: string;
};

/**
 * Najniższa cena obowiązująca w oknie ostatnich 30 dni
 * (uwzględnia cenę sprzed początku okna, jeśli nadal wtedy obowiązywała).
 */
export function computeLowestPriceInLast30Days(
  history: HistoryRow[],
  now = new Date(),
): number | null {
  if (history.length === 0) return null;

  const sorted = [...history].sort(
    (a, b) =>
      new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime(),
  );

  const windowStart = new Date(now);
  windowStart.setDate(windowStart.getDate() - 30);
  const windowStartMs = windowStart.getTime();

  let priceAtWindowStart: number | null = null;
  for (const row of sorted) {
    const at = new Date(row.recorded_at).getTime();
    if (at <= windowStartMs) {
      priceAtWindowStart = Number(row.effective_price);
    } else {
      break;
    }
  }

  const candidates: number[] = [];
  if (priceAtWindowStart != null && Number.isFinite(priceAtWindowStart)) {
    candidates.push(priceAtWindowStart);
  }

  for (const row of sorted) {
    const at = new Date(row.recorded_at).getTime();
    if (at > windowStartMs && at <= now.getTime()) {
      const value = Number(row.effective_price);
      if (Number.isFinite(value)) candidates.push(value);
    }
  }

  // Brak wpisu sprzed okna - bierz pierwszy wpis w historii w oknie albo cały min.
  if (candidates.length === 0) {
    const values = sorted
      .map((row) => Number(row.effective_price))
      .filter((value) => Number.isFinite(value));
    return values.length > 0 ? Math.min(...values) : null;
  }

  return Math.min(...candidates);
}

/**
 * Zapisuje zmianę ceny w historii i wylicza najniższą cenę z ostatnich 30 dni.
 */
export async function syncCoursePriceHistory(
  courseId: string,
  price: number,
  discountPrice: number | null,
  client?: SupabaseClient,
): Promise<void> {
  const supabase = client ?? createAdminClient();
  const effectivePrice = getCourseEffectivePrice(price, discountPrice);
  const hasPromo = discountPrice != null && discountPrice < price;

  const { data: lastRows, error: lastError } = await supabase
    .from("course_price_history")
    .select("effective_price")
    .eq("course_id", courseId)
    .order("recorded_at", { ascending: false })
    .limit(1);

  if (lastError) {
    throw new Error(lastError.message);
  }

  const lastEffective =
    lastRows?.[0]?.effective_price == null
      ? null
      : Number(lastRows[0].effective_price);

  if (lastEffective == null || lastEffective !== effectivePrice) {
    const { error: insertError } = await supabase
      .from("course_price_history")
      .insert({
        course_id: courseId,
        effective_price: effectivePrice,
        price,
        discount_price: hasPromo ? discountPrice : null,
      });

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  const { data: historyRows, error: historyError } = await supabase
    .from("course_price_history")
    .select("effective_price, recorded_at")
    .eq("course_id", courseId)
    .order("recorded_at", { ascending: true });

  if (historyError) {
    throw new Error(historyError.message);
  }

  const lowest = computeLowestPriceInLast30Days(historyRows ?? []);

  const { error: updateError } = await supabase
    .from("courses")
    .update({ lowest_price_30_days: lowest })
    .eq("id", courseId);

  if (updateError) {
    throw new Error(updateError.message);
  }
}
