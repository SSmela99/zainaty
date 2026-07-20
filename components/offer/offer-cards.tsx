"use client";

import { Floater } from "@/components/hero/floater";
import { Reveal } from "@/components/reveal";

import { OfferCard } from "./offer-card";
import { offerCards } from "./offer-cards.utils";

export function OfferCards() {
  return (
    <section className="relative bg-[#e8e4d8] pt-0 pb-12 md:pb-16 dark:bg-[#151414]">
      <Floater
        className="top-[38%] right-4 hidden md:block"
        duration={5.4}
        delay={0.2}
      >
        <svg
          viewBox="0 0 60 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden
          className="h-8 w-16 text-[#0033ff]/40 dark:text-[#6688ff]/30"
        >
          <path d="M4 22 L14 8 L24 22 L34 8 L44 22 L54 8" />
        </svg>
      </Floater>

      <div className="relative z-10 mx-auto max-w-350 space-y-6 px-8 py-2 md:space-y-8">
        {offerCards.map((card, index) => (
          <Reveal key={card.id} delay={index * 0.12}>
            <OfferCard card={card} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
