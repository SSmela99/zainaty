import { getStripe } from "./server";

type GetOrCreateStripeCustomerParams = {
  email: string;
  userId?: string;
};

export async function getOrCreateStripeCustomer({
  email,
  userId,
}: GetOrCreateStripeCustomerParams): Promise<string> {
  const stripe = getStripe();
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await stripe.customers.list({
    email: normalizedEmail,
    limit: 10,
  });

  const byUserId = userId
    ? existing.data.find(
        (customer) => customer.metadata?.supabaseUserId === userId,
      )
    : undefined;
  const customer = byUserId ?? existing.data[0];

  if (customer) {
    if (userId && customer.metadata?.supabaseUserId !== userId) {
      await stripe.customers.update(customer.id, {
        metadata: {
          ...customer.metadata,
          supabaseUserId: userId,
        },
      });
    }

    return customer.id;
  }

  const created = await stripe.customers.create({
    email: normalizedEmail,
    metadata: {
      supabaseUserId: userId ?? "",
    },
  });

  return created.id;
}
