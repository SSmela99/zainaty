"use client";

import { OfferCard } from "./offer-card";
import { offerCards } from "./offer-cards.utils";

export function OfferCards() {
  return (
    <section className="relative bg-[#ebe3d4] pt-0 pb-12 md:pb-16 dark:bg-[#0a0a0a]">
      <svg
        viewBox="0 0 60 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        aria-hidden
        className="pointer-events-none absolute top-[38%] right-4 hidden h-8 w-16 text-[#1a4dff]/40 md:block dark:text-[#7d9bff]/30"
      >
        <path d="M4 22 L14 8 L24 22 L34 8 L44 22 L54 8" />
      </svg>

      <div className="relative mx-auto max-w-350 space-y-6 px-8 py-2 md:space-y-8">
        {offerCards.map((card) => (
          <OfferCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  );
}
