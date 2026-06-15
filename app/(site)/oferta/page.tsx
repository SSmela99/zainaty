import type { Metadata } from "next";

import { OfferCards, OfferContact, OfferHero } from "@/components/offer";

export const metadata: Metadata = {
  title: "Oferta",
  description:
    "Praktyczne kursy, indywidualne szkolenia i programy dla firm — wybierz formę wsparcia dopasowaną do Twoich potrzeb.",
};

export default function OfertaPage() {
  return (
    <>
      <OfferHero />
      <OfferCards />
      <OfferContact />
    </>
  );
}
