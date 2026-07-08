import { createAdminClient } from "@/lib/supabase/admin";

import { buildAppliedDiscount } from "./apply";
import { normalizeDiscountCode } from "./normalize";
import type { AppliedDiscount, DiscountCode } from "./types";

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

export type DiscountValidationError =
  | "empty"
  | "not_found"
  | "inactive"
  | "expired"
  | "limit_reached"
  | "wrong_course";

const errorMessages: Record<DiscountValidationError, string> = {
  empty: "Podaj kod rabatowy.",
  not_found: "Nieprawidłowy kod rabatowy.",
  inactive: "Ten kod rabatowy jest nieaktywny.",
  expired: "Ten kod rabatowy wygasł.",
  limit_reached: "Limit użyć tego kodu został wyczerpany.",
  wrong_course: "Ten kod nie obowiązuje na wybrany kurs.",
};

export function getDiscountValidationMessage(error: DiscountValidationError): string {
  return errorMessages[error];
}

function validateDiscountCodeRecord(
  record: DiscountCode,
  courseId: string,
): DiscountValidationError | null {
  if (!record.active) {
    return "inactive";
  }

  if (record.expires_at && new Date(record.expires_at).getTime() <= Date.now()) {
    return "expired";
  }

  if (record.max_uses != null && record.used_count >= record.max_uses) {
    return "limit_reached";
  }

  if (record.course_id && record.course_id !== courseId) {
    return "wrong_course";
  }

  return null;
}

export async function fetchDiscountCodeByCode(
  rawCode: string,
): Promise<DiscountCode | null> {
  const normalizedCode = normalizeDiscountCode(rawCode);

  if (!normalizedCode) {
    return null;
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("discount_codes")
    .select("*, courses(title)")
    .eq("code", normalizedCode)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapDiscountCode(data as Record<string, unknown>);
}

export async function validateDiscountForCourse(
  rawCode: string,
  courseId: string,
  basePricePln: number,
): Promise<
  | { ok: true; applied: AppliedDiscount }
  | { ok: false; error: DiscountValidationError }
> {
  const normalizedCode = normalizeDiscountCode(rawCode);

  if (!normalizedCode) {
    return { ok: false, error: "empty" };
  }

  const record = await fetchDiscountCodeByCode(normalizedCode);

  if (!record) {
    return { ok: false, error: "not_found" };
  }

  const validationError = validateDiscountCodeRecord(record, courseId);

  if (validationError) {
    return { ok: false, error: validationError };
  }

  return {
    ok: true,
    applied: buildAppliedDiscount(record, basePricePln),
  };
}

export async function incrementDiscountCodeUsage(codeId: string): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.rpc("increment_discount_code_usage", {
    p_code_id: codeId,
  });

  if (error) {
    throw error;
  }
}
