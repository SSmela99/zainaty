"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/auth/require-admin";
import { normalizeDiscountCode } from "@/lib/discount-codes/normalize";
import type {
  DiscountCode,
  DiscountCodeActionResult,
  DiscountCodeFormInput,
} from "@/lib/discount-codes/types";

function mapDiscountCode(row: Record<string, unknown>): DiscountCode {
  const course = row.courses as Record<string, unknown> | null | undefined;

  return {
    id: row.id as string,
    code: row.code as string,
    discount_type: row.discount_type as DiscountCode["discount_type"],
    discount_value: Number(row.discount_value),
    expires_at: (row.expires_at as string | null) ?? null,
    max_uses: row.max_uses == null ? null : Number(row.max_uses),
    used_count: Number(row.used_count),
    course_id: (row.course_id as string | null) ?? null,
    course_title: (course?.title as string | null) ?? null,
    active: row.active as boolean,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function listDiscountCodes(): Promise<DiscountCodeActionResult<DiscountCode[]>> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*, courses(title)")
      .order("created_at", { ascending: false });

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: (data ?? []).map(mapDiscountCode) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function createDiscountCode(
  input: DiscountCodeFormInput,
): Promise<DiscountCodeActionResult<DiscountCode>> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("discount_codes")
      .insert({
        ...input,
        code: normalizeDiscountCode(input.code),
      })
      .select("*, courses(title)")
      .single();

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/admin");
    return { ok: true, data: mapDiscountCode(data) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function updateDiscountCode(
  id: string,
  input: DiscountCodeFormInput,
): Promise<DiscountCodeActionResult<DiscountCode>> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("discount_codes")
      .update({
        ...input,
        code: normalizeDiscountCode(input.code),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("*, courses(title)")
      .single();

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/admin");
    return { ok: true, data: mapDiscountCode(data) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function deleteDiscountCode(
  id: string,
): Promise<DiscountCodeActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("discount_codes").delete().eq("id", id);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath("/admin");
    return { ok: true };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}
