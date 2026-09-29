/** Publiczny URL strony (bez zależności od Stripe). */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!url) {
    return "http://localhost:3000";
  }

  return url.replace(/\/$/, "");
}
