export function getCourseEffectivePrice(
  price: number,
  discountPrice: number | null,
): number {
  if (discountPrice != null && discountPrice < price) {
    return discountPrice;
  }

  return price;
}
