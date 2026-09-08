import type { Metadata } from "next";

import { FaqAccordion, FaqContactCta, FaqHero } from "@/components/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { getPublishedFaqItems } from "@/lib/faq/queries";
import { PATHS } from "@/lib/paths";
import { faqPageJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "FAQ",
  description:
    "Najczęściej zadawane pytania o AI, ChatGPT i korzystanie z naszych materiałów - odpowiedzi po ludzku.",
  path: PATHS.FAQ,
});

export default async function FaqPage() {
  const items = await getPublishedFaqItems();

  return (
    <div className="site-container pb-20 md:pb-28">
      {items.length > 0 ? <JsonLd data={faqPageJsonLd(items)} /> : null}
      <FaqHero />
      <FaqAccordion items={items} />
      <FaqContactCta />
    </div>
  );
}
