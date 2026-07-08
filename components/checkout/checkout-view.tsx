"use client";

import { ArrowLeftIcon, CreditCardIcon, LockIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { createCheckoutSession } from "@/app/actions/checkout";
import { getCourseEffectivePrice } from "@/lib/checkout/pricing";
import { formatCoursePriceCompact } from "@/lib/courses/format";
import type { Course } from "@/lib/courses/types";
import type { AppliedDiscount } from "@/lib/discount-codes/types";
import { coursePath, PATHS } from "@/lib/paths";

import { CheckoutDiscountCode } from "./checkout-discount-code";
import { CheckoutOrderSummary } from "./checkout-order-summary";
import { checkoutContent } from "./checkout.utils";

type CheckoutViewProps = {
  course: Course;
  isLoggedIn?: boolean;
  initialCode?: string;
};

export function CheckoutView({
  course,
  isLoggedIn = false,
  initialCode,
}: CheckoutViewProps) {
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [purchaseAsBusiness, setPurchaseAsBusiness] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(
    null,
  );

  const basePricePln = getCourseEffectivePrice(course.price, course.discount_price);
  const priceLabel = formatCoursePriceCompact(
    appliedDiscount?.finalPricePln ?? basePricePln,
  );

  async function handlePay() {
    if (!legalAccepted) {
      toast.error(checkoutContent.errors.legalRequired);
      return;
    }

    setIsSubmitting(true);

    const result = await createCheckoutSession(
      course.slug,
      appliedDiscount?.code,
      purchaseAsBusiness,
    );

    if (!result.ok) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    window.location.href = result.url;
  }

  return (
    <section className="px-8 pb-20 md:pb-28">
      <div className="mx-auto max-w-350 pt-10 md:pt-14">
        <Link
          href={coursePath(course.slug)}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#ff4b12] transition-colors hover:text-[#1a4dff] dark:text-[#ff6b4a] dark:hover:text-[#d7ff00]"
        >
          <ArrowLeftIcon className="size-4" strokeWidth={2.2} />
          Wróć do kursu
        </Link>

        <h1 className="mt-4 text-3xl leading-[1.08] font-black tracking-[-0.03em] text-zinc-950 md:text-4xl dark:text-white">
          {checkoutContent.pageTitle}
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          {checkoutContent.pageDescription}
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="order-2 space-y-4 lg:order-1">
            <CheckoutDiscountCode
              courseSlug={course.slug}
              initialCode={initialCode}
              applied={appliedDiscount}
              onApplied={setAppliedDiscount}
            />

            <div className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] md:p-8 dark:bg-[#1c1c1c] dark:shadow-[0_8px_32px_rgba(0,0,0,0.28)]">
              <div className="flex items-center gap-2.5">
                <CreditCardIcon
                  className="size-5 text-[#ff4b12] dark:text-[#d7ff00]"
                  strokeWidth={2.2}
                />
                <h2 className="text-lg font-black tracking-[-0.02em] text-zinc-950 dark:text-white">
                  {checkoutContent.paymentCardTitle}
                </h2>
              </div>

              <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {checkoutContent.stripeNote}
              </p>

              {isLoggedIn ? (
                <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                  Jesteś zalogowany — po płatności kurs pojawi się też na Twoim koncie.
                </p>
              ) : null}

              <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#ded9cf] bg-white p-4 text-sm leading-6 text-zinc-600 dark:border-[#282828] dark:bg-[#141414] dark:text-zinc-400">
                <input
                  type="checkbox"
                  checked={purchaseAsBusiness}
                  onChange={(event) => setPurchaseAsBusiness(event.target.checked)}
                  disabled={isSubmitting}
                  className="mt-1 size-4 shrink-0 cursor-pointer rounded border-[#ded9cf] accent-[#ff4b12] dark:border-zinc-600 dark:accent-[#d7ff00]"
                />
                <span>
                  <span className="font-bold text-zinc-950 dark:text-white">
                    {checkoutContent.businessPurchaseLabel}
                  </span>
                  <span className="mt-1 block text-zinc-500 dark:text-zinc-400">
                    {checkoutContent.businessPurchaseHint}
                  </span>
                </span>
              </label>

              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-[#ded9cf] bg-[#f7f3ea] p-4 text-sm leading-6 text-zinc-600 dark:border-[#282828] dark:bg-[#242424] dark:text-zinc-400">
                <input
                  type="checkbox"
                  checked={legalAccepted}
                  onChange={(event) => setLegalAccepted(event.target.checked)}
                  disabled={isSubmitting}
                  className="mt-1 size-4 shrink-0 cursor-pointer rounded border-[#ded9cf] accent-[#ff4b12] dark:border-zinc-600 dark:accent-[#d7ff00]"
                />
                <span>
                  {checkoutContent.legalPrefix}{" "}
                  <Link
                    href={PATHS.TERMS}
                    className="font-bold text-[#1a4dff] underline-offset-2 hover:underline"
                    target="_blank"
                  >
                    {checkoutContent.termsLabel}
                  </Link>{" "}
                  {checkoutContent.legalJoiner}{" "}
                  <Link
                    href={PATHS.PRIVACY}
                    className="font-bold text-[#1a4dff] underline-offset-2 hover:underline"
                    target="_blank"
                  >
                    {checkoutContent.privacyLabel}
                  </Link>
                  . {checkoutContent.legalSuffix}
                </span>
              </label>

              <button
                type="button"
                onClick={handlePay}
                disabled={isSubmitting}
                className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl bg-[#ff4b12] text-base font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#d7ff00] dark:text-zinc-950"
              >
                <LockIcon className="size-5" strokeWidth={2.2} />
                {isSubmitting
                  ? "Przekierowanie..."
                  : checkoutContent.payButton(priceLabel)}
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
            <CheckoutOrderSummary
              course={course}
              appliedDiscount={appliedDiscount}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
