import type { Metadata } from "next";

import { OfferCards, OfferContact, OfferHero } from "@/components/offer";
import { PATHS } from "@/lib/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Oferta",
  description:
    "Praktyczne kursy, indywidualne szkolenia i programy dla firm — wybierz formę wsparcia dopasowaną do Twoich potrzeb.",
  path: PATHS.OFFER,
});

export default function OfertaPage() {
  return (
    <>
      <OfferHero />
      <OfferCards />
      <OfferContact />
    </>
  );
}
