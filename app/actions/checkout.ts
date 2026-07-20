"use server";

import { getCourseEffectivePrice } from "@/lib/checkout/pricing";
import { userOwnsCourse } from "@/lib/courses/access";
import { getPublishedCourseBySlug } from "@/lib/courses/queries";
import {
  getDiscountValidationMessage,
  validateDiscountForCourse,
} from "@/lib/discount-codes/validate";
import { checkoutPath, PATHS } from "@/lib/paths";
import { getSiteUrl } from "@/lib/stripe/config";
import { getStripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

export type CheckoutActionResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function createCheckoutSession(
  courseSlug: string,
  discountCode?: string,
  purchaseAsBusiness = false,
): Promise<CheckoutActionResult> {
  const course = await getPublishedCourseBySlug(courseSlug);

  if (!course) {
    return { ok: false, error: "Kurs nie istnieje lub nie jest dostępny." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const hasAccess = await userOwnsCourse(supabase, user.id, course.id);

    if (hasAccess) {
      return { ok: false, error: "Masz już dostęp do tego kursu." };
    }
  }

  const basePricePln = getCourseEffectivePrice(course.price, course.discount_price);
  let finalPricePln = basePricePln;
  let discountCodeId: string | null = null;
  let discountCodeLabel: string | null = null;

  if (discountCode?.trim()) {
    const discountResult = await validateDiscountForCourse(
      discountCode,
      course.id,
      basePricePln,
    );

    if (!discountResult.ok) {
      return { ok: false, error: getDiscountValidationMessage(discountResult.error) };
    }

    finalPricePln = discountResult.applied.finalPricePln;
    discountCodeId = discountResult.applied.codeId;
    discountCodeLabel = discountResult.applied.code;
  }

  const unitAmount = Math.round(finalPricePln * 100);

  if (unitAmount < 200) {
    return { ok: false, error: "Cena kursu jest zbyt niska do płatności online." };
  }

  let stripe;

  try {
    stripe = getStripe();
  } catch {
    return { ok: false, error: "Płatności nie są skonfigurowane. Spróbuj później." };
  }

  const siteUrl = getSiteUrl();
  const successUrl = user
    ? `${siteUrl}${PATHS.ACCOUNT}?zakup=ok`
    : `${siteUrl}${PATHS.SET_PASSWORD}?zakup=ok&next=${encodeURIComponent(PATHS.ACCOUNT)}`;

  const productName =
    discountCodeLabel != null
      ? `${course.title} (kod ${discountCodeLabel})`
      : course.title;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      currency: "pln",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "pln",
            unit_amount: unitAmount,
            product_data: {
              name: productName,
              description: course.format_label || undefined,
              images: course.cover_image_url ? [course.cover_image_url] : undefined,
            },
          },
        },
      ],
      metadata: {
        courseId: course.id,
        courseSlug: course.slug,
        userId: user?.id ?? "",
        discountCodeId: discountCodeId ?? "",
        purchaseAsBusiness: purchaseAsBusiness ? "true" : "false",
      },
      ...(user?.email ? { customer_email: user.email } : {}),
      ...(purchaseAsBusiness
        ? {
            billing_address_collection: "required" as const,
            tax_id_collection: {
              enabled: true,
              required: "if_supported" as const,
            },
            invoice_creation: {
              enabled: true,
              invoice_data: {
                description: `Zakup kursu: ${course.title}`,
                metadata: {
                  courseSlug: course.slug,
                },
              },
            },
          }
        : {}),
      success_url: successUrl,
      cancel_url: `${siteUrl}${checkoutPath(course.slug)}`,
    });

    if (!session.url) {
      return { ok: false, error: "Nie udało się przygotować płatności." };
    }

    return { ok: true, url: session.url };
  } catch (error) {
    console.error("[checkout] createCheckoutSession", error);
    return { ok: false, error: "Nie udało się rozpocząć płatności. Spróbuj ponownie." };
  }
}
