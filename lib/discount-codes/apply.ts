import type { DiscountCode, DiscountType } from "./types";

const MIN_CHECKOUT_PRICE_PLN = 2;

export function formatDiscountLabel(
  discountType: DiscountType,
  discountValue: number,
): string {
  if (discountType === "percent") {
    return `-${Math.round(discountValue)}%`;
  }

  return `-${new Intl.NumberFormat("pl-PL", {
    maximumFractionDigits: 0,
  }).format(discountValue)} zł`;
}

export function applyDiscountToPrice(
  basePricePln: number,
  discountType: DiscountType,
  discountValue: number,
): number {
  let finalPrice =
    discountType === "percent"
      ? basePricePln * (1 - discountValue / 100)
      : basePricePln - discountValue;

  finalPrice = Math.round(finalPrice * 100) / 100;

  return Math.max(MIN_CHECKOUT_PRICE_PLN, finalPrice);
}

export function getDiscountSavings(
  basePricePln: number,
  finalPricePln: number,
): number {
  return Math.max(0, Math.round((basePricePln - finalPricePln) * 100) / 100);
}

export function buildAppliedDiscount(
  code: Pick<DiscountCode, "id" | "code" | "discount_type" | "discount_value">,
  basePricePln: number,
) {
  const finalPricePln = applyDiscountToPrice(
    basePricePln,
    code.discount_type,
    code.discount_value,
  );

  return {
    codeId: code.id,
    code: code.code,
    label: formatDiscountLabel(code.discount_type, code.discount_value),
    basePricePln,
    finalPricePln,
    savingsPln: getDiscountSavings(basePricePln, finalPricePln),
  };
}
