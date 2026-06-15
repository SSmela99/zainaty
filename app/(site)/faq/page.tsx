import type { Metadata } from "next";

import { FaqAccordion, FaqContactCta, FaqHero } from "@/components/faq";
import { getPublishedFaqItems } from "@/lib/faq/queries";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Najczęściej zadawane pytania o AI, ChatGPT i korzystanie z naszych materiałów — odpowiedzi po ludzku.",
};

export default async function FaqPage() {
  const items = await getPublishedFaqItems();

  return (
    <div className="mx-auto max-w-350 px-8 pb-20 md:pb-28">
      <FaqHero />
      <FaqAccordion items={items} />
      <FaqContactCta />
    </div>
  );
}
