"use client";

import {
  ArrowRightIcon,
  BookOpenIcon,
  Building2Icon,
  CheckIcon,
  GraduationCapIcon,
  UserRoundIcon,
} from "lucide-react";
import Link from "next/link";

import { handleConsultationRedirect } from "@/lib/consultation";
import { scrollToSection } from "@/lib/scroll-to-section";

import {
  OFFER_CARD_ICON,
  type OfferCardData,
  type OfferCardIcon,
} from "./offer-cards.utils";
import { OFFER_CONTACT_SCROLL_OFFSET } from "./offer-contact.utils";

const OFFER_CARD_ICONS = {
  [OFFER_CARD_ICON.BOOK]: BookOpenIcon,
  [OFFER_CARD_ICON.USER]: UserRoundIcon,
  [OFFER_CARD_ICON.BUILDING]: Building2Icon,
  [OFFER_CARD_ICON.SCHOOL]: GraduationCapIcon,
} satisfies Record<OfferCardIcon, typeof BookOpenIcon>;

type OfferCardProps = {
  card: OfferCardData;
};

export function OfferCard({ card }: OfferCardProps) {
  const { theme } = card;
  const CardIcon = OFFER_CARD_ICONS[card.iconKey];

  const ctaClassName = `inline-flex h-12 cursor-pointer items-center gap-2 rounded-xl px-6 text-sm font-black transition-transform disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 ${theme.button}`;

  function handleLinkClick(
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    if (!href.startsWith("#")) {
      return;
    }

    event.preventDefault();
    scrollToSection(href.slice(1), OFFER_CONTACT_SCROLL_OFFSET);
  }

  return (
    <article
      className={`group/card relative rounded-3xl p-8 shadow-sm ring-2 ring-transparent transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg md:p-12 dark:shadow-none dark:hover:shadow-none ${theme.card} ${theme.hoverRing}`}
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute top-4 right-6 select-none text-8xl leading-none font-black md:top-6 md:right-10 md:text-9xl ${theme.number}`}
      >
        {card.number}
      </span>

      <div className="relative max-w-xl">
        <h2 className="text-2xl font-black tracking-[0.02em] text-zinc-950 md:text-3xl dark:text-white">
          {card.title}
        </h2>

        <ul className="mt-8 space-y-4">
          {card.features.map((feature) => (
            <li
              key={feature}
              className="group/item flex cursor-default items-start gap-3 transition-transform duration-300 ease-out hover:translate-x-4"
            >
              <CheckIcon
                strokeWidth={3}
                aria-hidden
                className={`mt-0.5 size-4 shrink-0 transition-transform duration-300 ease-out group-hover/item:scale-125 ${theme.check}`}
              />
              <span className="text-sm leading-6 text-zinc-700 md:text-base dark:text-zinc-300">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          {card.ctaType === "consultation" ? (
            <button
              type="button"
              onClick={handleConsultationRedirect}
              className={ctaClassName}
            >
              {card.ctaLabel}
              <ArrowRightIcon className="size-4" strokeWidth={2.5} />
            </button>
          ) : (
            <Link
              href={card.ctaHref ?? "#"}
              className={ctaClassName}
              onClick={(event) =>
                handleLinkClick(event, card.ctaHref ?? "#")
              }
            >
              {card.ctaLabel}
              <ArrowRightIcon className="size-4" strokeWidth={2.5} />
            </Link>
          )}
        </div>
      </div>

      <div
        className={`absolute right-8 bottom-8 flex size-12 items-center justify-center rounded-xl md:size-14 ${theme.iconBox}`}
      >
        <CardIcon
          strokeWidth={2.2}
          className={`size-5 md:size-6 ${theme.iconClass}`}
        />
      </div>
    </article>
  );
}
