"use client";

import { Reveal } from "@/components/reveal";

import { OfferCard } from "./offer-card";
import { offerCards } from "./offer-cards.utils";

export function OfferCards() {
  return (
    <section className="relative bg-[#e8e4d8] pt-12 pb-12 md:pb-16 md:pt-16 dark:bg-[#151414]">
      <div className="relative z-10 site-container-medium space-y-6 py-2 md:space-y-8">
        {offerCards.map((card, index) => (
          <Reveal key={card.id} delay={index * 0.12}>
            <OfferCard card={card} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
