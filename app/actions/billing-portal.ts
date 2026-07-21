"use server";

import { PATHS } from "@/lib/paths";
import { getSiteUrl } from "@/lib/stripe/config";
import { getOrCreateStripeCustomer } from "@/lib/stripe/customer";
import { getStripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

export type BillingPortalActionResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function createBillingPortalSession(): Promise<BillingPortalActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { ok: false, error: "Musisz być zalogowany, aby otworzyć faktury." };
  }

  let stripe;

  try {
    stripe = getStripe();
  } catch {
    return { ok: false, error: "Płatności nie są skonfigurowane. Spróbuj później." };
  }

  try {
    const customerId = await getOrCreateStripeCustomer({
      email: user.email,
      userId: user.id,
    });

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${getSiteUrl()}${PATHS.ACCOUNT}`,
    });

    if (!session.url) {
      return { ok: false, error: "Nie udało się otworzyć panelu faktur." };
    }

    return { ok: true, url: session.url };
  } catch (error) {
    console.error("[billing-portal] createBillingPortalSession", error);

    const message = error instanceof Error ? error.message : "";

    if (
      message.includes("No configuration provided") ||
      message.includes("customer portal") ||
      message.includes("billing portal")
    ) {
      return {
        ok: false,
        error:
          "Customer Portal nie jest jeszcze włączony w Stripe. Włącz go w Dashboard → Settings → Billing → Customer portal.",
      };
    }

    return {
      ok: false,
      error: "Nie udało się otworzyć faktur. Spróbuj ponownie.",
    };
  }
}
