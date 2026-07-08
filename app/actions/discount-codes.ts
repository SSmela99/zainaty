"use server";

import { getCourseEffectivePrice } from "@/lib/checkout/pricing";
import { getPublishedCourseBySlug } from "@/lib/courses/queries";
import type { AppliedDiscount } from "@/lib/discount-codes/types";
import {
  getDiscountValidationMessage,
  validateDiscountForCourse,
} from "@/lib/discount-codes/validate";

export type ApplyDiscountCodeResult =
  | { ok: true; applied: AppliedDiscount }
  | { ok: false; error: string };

export async function applyDiscountCode(
  courseSlug: string,
  rawCode: string,
): Promise<ApplyDiscountCodeResult> {
  const course = await getPublishedCourseBySlug(courseSlug);

  if (!course) {
    return { ok: false, error: "Kurs nie istnieje lub nie jest dostępny." };
  }

  const basePricePln = getCourseEffectivePrice(course.price, course.discount_price);
  const result = await validateDiscountForCourse(rawCode, course.id, basePricePln);

  if (!result.ok) {
    return { ok: false, error: getDiscountValidationMessage(result.error) };
  }

  return { ok: true, applied: result.applied };
}
