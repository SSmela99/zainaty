export const DISCOUNT_TYPE = {
  PERCENT: "percent",
  FIXED: "fixed",
} as const;

export type DiscountType = (typeof DISCOUNT_TYPE)[keyof typeof DISCOUNT_TYPE];

export type DiscountCode = {
  id: string;
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  expires_at: string | null;
  max_uses: number | null;
  used_count: number;
  course_id: string | null;
  course_title: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type DiscountCodeFormInput = {
  code: string;
  discount_type: DiscountType;
  discount_value: number;
  expires_at: string | null;
  max_uses: number | null;
  course_id: string | null;
  active: boolean;
};

export type DiscountCodeActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

export type AppliedDiscount = {
  codeId: string;
  code: string;
  label: string;
  basePricePln: number;
  finalPricePln: number;
  savingsPln: number;
};
