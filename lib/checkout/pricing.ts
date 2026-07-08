export function getCourseEffectivePrice(
  price: number,
  discountPrice: number | null,
): number {
  if (discountPrice != null && discountPrice < price) {
    return discountPrice;
  }

  return price;
}

/** Kwota VAT w cenie brutto (stawka 23%). */
export function getGrossVatAmount(grossPln: number): number {
  const vat = grossPln - grossPln / 1.23;
  return Math.round(vat);
}
