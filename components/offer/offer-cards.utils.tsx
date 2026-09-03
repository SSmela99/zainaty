import { PATHS } from "@/lib/paths";

import { OFFER_CONTACT_SECTION_ID } from "./offer-contact.utils";

export const OFFER_CARD_ICON = {
  BOOK: "book",
  USER: "user",
  BUILDING: "building",
  SCHOOL: "school",
} as const;

export type OfferCardIcon =
  (typeof OFFER_CARD_ICON)[keyof typeof OFFER_CARD_ICON];

export type OfferCardTheme = {
  card: string;
  number: string;
  check: string;
  iconBox: string;
  iconClass: string;
  button: string;
  hoverRing: string;
};

export type OfferCardData = {
  id: string;
  number: string;
  title: string;
  features: readonly string[];
  ctaLabel: string;
  ctaType: "link" | "consultation";
  ctaHref?: string;
  iconKey: OfferCardIcon;
  theme: OfferCardTheme;
};

const THEME = {
  courses: {
    card: "bg-white dark:bg-[#1c1c1c]",
    number: "text-zinc-200 dark:text-zinc-700",
    check: "text-[#f24a00] dark:text-[#daff02]",
    iconBox: "bg-[#ffd0bc] dark:bg-[#3a4500]",
    iconClass: "text-[#f24a00] dark:text-[#daff02]",
    button:
      "bg-[#f24a00] text-white hover:-translate-y-0.5 hover:scale-105 dark:bg-[#daff02] dark:text-zinc-950",
    hoverRing: "hover:ring-2 hover:ring-[#f24a00] dark:hover:ring-[#daff02]",
  },
  individual: {
    card: "bg-[#ddcfde] dark:bg-[#2d1b3d]",
    number: "text-[#6b1cb1]/15 dark:text-[#b57ae0]/15",
    check: "text-[#0033ff] dark:text-[#6688ff]",
    iconBox: "bg-[#0033ff] dark:bg-[#1a2a5e]",
    iconClass: "text-white dark:text-[#6688ff]",
    button:
      "bg-zinc-950 text-white hover:-translate-y-0.5 hover:scale-105 dark:bg-white dark:text-zinc-950",
    hoverRing: "hover:ring-2 hover:ring-[#0033ff] dark:hover:ring-[#6688ff]",
  },
  business: {
    card: "bg-white dark:bg-[#1c1c1c]",
    number: "text-zinc-200 dark:text-zinc-700",
    check: "text-[#6b1cb1] dark:text-[#b57ae0]",
    iconBox: "bg-[#ddcfde] dark:bg-[#2a1230]",
    iconClass: "text-[#6b1cb1] dark:text-[#b57ae0]",
    button:
      "bg-[#6b1cb1] text-white hover:-translate-y-0.5 hover:scale-105 dark:bg-[#b57ae0] dark:text-zinc-950",
    hoverRing: "hover:ring-2 hover:ring-[#6b1cb1] dark:hover:ring-[#b57ae0]",
  },
  schools: {
    card: "bg-[#ddcfde] dark:bg-[#2d1b3d]",
    number: "text-[#6b1cb1]/15 dark:text-[#b57ae0]/15",
    check: "text-[#0033ff] dark:text-[#6688ff]",
    iconBox: "bg-[#0033ff] dark:bg-[#1a2a5e]",
    iconClass: "text-white dark:text-[#6688ff]",
    button:
      "bg-zinc-950 text-white hover:-translate-y-0.5 hover:scale-105 dark:bg-white dark:text-zinc-950",
    hoverRing: "hover:ring-2 hover:ring-[#0033ff] dark:hover:ring-[#6688ff]",
  },
} satisfies Record<string, OfferCardTheme>;

export const offerCards: OfferCardData[] = [
  {
    id: "courses",
    number: "01",
    title: "Szkolenia na stronie",
    features: [
      "Praktyczna wiedza w przystępnej formie — PDF i wideo",
      "Nauka we własnym tempie",
      "Ciągła aktualizacja treści",
      "Dostęp od razu po zakupie",
    ],
    ctaLabel: "Zobacz kursy",
    ctaType: "link",
    ctaHref: PATHS.COURSES,
    iconKey: OFFER_CARD_ICON.BOOK,
    theme: THEME.courses,
  },
  {
    id: "individual-training",
    number: "02",
    title: "Szkolenia indywidualne",
    features: [
      "Nauka 1:1 — dopasowana do Twojego poziomu i celu",
      "Tempo dostosowane do Twoich potrzeb",
      "Pełne wsparcie i zaangażowanie",
      "Zero presji i oceniania",
    ],
    ctaLabel: "Porozmawiajmy",
    ctaType: "consultation",
    iconKey: OFFER_CARD_ICON.USER,
    theme: THEME.individual,
  },
  {
    id: "business-training",
    number: "03",
    title: "Szkolenia dla firm",
    features: [
      "AI dla mikro i małych firm",
      "Realne oszczędności czasu i pieniędzy",
      "Wdrożenie dostosowane do Twojej branży",
      "Konkretne zastosowania AI w Twojej codziennej pracy",
    ],
    ctaLabel: "Porozmawiajmy",
    ctaType: "link",
    ctaHref: `#${OFFER_CONTACT_SECTION_ID}`,
    iconKey: OFFER_CARD_ICON.BUILDING,
    theme: THEME.business,
  },
  {
    id: "schools-training",
    number: "04",
    title: "Szkolenia dla szkół i instytucji",
    features: [
      "Program dopasowany do specyfiki placówki",
      "Szkolenia dla nauczycieli, bibliotekarzy i pracowników instytucji publicznych",
      "Zajęcia stacjonarnie albo online, zależnie od możliwości placówki",
      "Zaczynamy od podstaw, nawet jeśli nikt wcześniej nie korzystał z AI",
    ],
    ctaLabel: "Porozmawiajmy",
    ctaType: "link",
    ctaHref: `#${OFFER_CONTACT_SECTION_ID}`,
    iconKey: OFFER_CARD_ICON.SCHOOL,
    theme: THEME.schools,
  },
];
