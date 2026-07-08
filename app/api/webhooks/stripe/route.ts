import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getStripeWebhookSecret } from "@/lib/stripe/config";
import { fulfillCoursePurchase } from "@/lib/stripe/fulfill-purchase";
import { getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const webhookSecret = getStripeWebhookSecret();

  if (!webhookSecret) {
    console.error("[stripe] STRIPE_WEBHOOK_SECRET is not configured.");
    return NextResponse.json(
      { error: "Webhook not configured." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe] Webhook signature verification failed.", error);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const email =
      session.customer_details?.email?.trim() ||
      session.customer_email?.trim() ||
      null;
    const courseId = session.metadata?.courseId?.trim() || null;

    if (!email || !courseId) {
      console.error("[stripe] Missing email or courseId in session.", session.id);
      return NextResponse.json(
        { error: "Missing purchase metadata." },
        { status: 400 },
      );
    }

    try {
      await fulfillCoursePurchase({
        email,
        courseId,
        stripeSessionId: session.id,
        discountCodeId: session.metadata?.discountCodeId || null,
      });
    } catch (error) {
      console.error("[stripe] fulfillCoursePurchase failed.", error);
      return NextResponse.json(
        { error: "Failed to fulfill purchase." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}
