import type Stripe from "stripe";

import { getStripeSecretKey } from "./config";

let stripeClient: Stripe | null = null;

export async function getStripe(): Promise<Stripe> {
  const secretKey = getStripeSecretKey();

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  if (!stripeClient) {
    const { default: Stripe } = await import("stripe");
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}
