import Image from "next/image";

import { getCourseEffectivePrice } from "@/lib/checkout/pricing";
import { formatCoursePriceCompact, getCourseExcerpt } from "@/lib/courses/format";
import type { Course } from "@/lib/courses/types";
import type { AppliedDiscount } from "@/lib/discount-codes/types";

import { checkoutContent } from "./checkout.utils";
import { CheckoutTrustBadges } from "./checkout-trust-badges";

type CheckoutOrderSummaryProps = {
  course: Course;
  appliedDiscount?: AppliedDiscount | null;
};

export function CheckoutOrderSummary({
  course,
  appliedDiscount = null,
}: CheckoutOrderSummaryProps) {
  const basePricePln = getCourseEffectivePrice(course.price, course.discount_price);
  const grossPrice = appliedDiscount?.finalPricePln ?? basePricePln;
  const priceLabel = formatCoursePriceCompact(grossPrice);
  const originalPriceLabel =
    appliedDiscount != null
      ? formatCoursePriceCompact(appliedDiscount.basePricePln)
      : null;
  const showOmnibus =
    course.lowest_price_30_days != null &&
    course.lowest_price_30_days < grossPrice;

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-[#ddd8ce] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] md:p-8 dark:border-[#282828] dark:bg-[#1c1c1c] dark:shadow-[0_8px_32px_rgba(0,0,0,0.28)]">
        <h2 className="text-lg font-black tracking-[0.02em] text-zinc-950 dark:text-white">
          {checkoutContent.orderTitle}
        </h2>

        <div className="mt-6 flex gap-4">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-[#f5f2e9] dark:bg-[#151414]">
            {course.cover_image_url ? (
              <Image
                src={course.cover_image_url}
                alt={course.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full items-center justify-center px-2 text-center text-xs font-black text-[#f24a00] dark:text-[#daff02]">
                {course.title}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-base font-black text-zinc-950 dark:text-white">
              {course.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {getCourseExcerpt(course.description, 88)}
            </p>
            <p className="mt-2 text-sm font-bold text-zinc-950 dark:text-white">
              {priceLabel}
            </p>
          </div>
        </div>

        <dl className="mt-6 space-y-3 border-t border-[#ddd8ce] pt-6 text-sm dark:border-[#282828]">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-zinc-500 dark:text-zinc-400">
              {checkoutContent.productPriceLabel}
            </dt>
            <dd className="font-semibold text-zinc-950 dark:text-white">
              {originalPriceLabel ?? priceLabel}
            </dd>
          </div>

          {appliedDiscount ? (
            <div className="flex items-center justify-between gap-4">
              <dt className="text-zinc-500 dark:text-zinc-400">
                Kod {appliedDiscount.code}
              </dt>
              <dd className="font-semibold text-[#f24a00] dark:text-[#ff6a3d]">
                -{formatCoursePriceCompact(appliedDiscount.savingsPln)}
              </dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-[#ddd8ce] pt-6 dark:border-[#282828]">
          <span className="text-base font-black text-zinc-950 dark:text-white">
            {checkoutContent.totalLabel}
          </span>
          <span className="text-3xl font-black tracking-[0.02em] text-[#f24a00] dark:text-[#ff6a3d]">
            {priceLabel}
          </span>
        </div>

        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          {checkoutContent.priceNote}
        </p>

        {showOmnibus ? (
          <p className="mt-3 rounded-2xl bg-[#f5f2e9] px-4 py-3 text-xs leading-5 text-zinc-600 dark:bg-[#242424] dark:text-zinc-400">
            {checkoutContent.lowestPriceLabel}:{" "}
            <span className="font-semibold text-zinc-950 dark:text-white">
              {formatCoursePriceCompact(course.lowest_price_30_days!)}
            </span>
          </p>
        ) : null}
      </div>

      <CheckoutTrustBadges />
    </div>
  );
}
