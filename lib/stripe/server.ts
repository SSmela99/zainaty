import Stripe from "stripe";

import { getStripeSecretKey } from "./config";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  const secretKey = getStripeSecretKey();

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}
