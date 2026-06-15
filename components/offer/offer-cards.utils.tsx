import { PATHS } from "@/lib/paths";

import { OFFER_CONTACT_SECTION_ID } from "./offer-contact.utils";

export const OFFER_CARD_ICON = {
  BOOK: "book",
  USER: "user",
  BUILDING: "building",
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
    check: "text-[#ff4b12] dark:text-[#d7ff00]",
    iconBox: "bg-[#ffe1cc] dark:bg-[#3a3d10]",
    iconClass: "text-[#ff4b12] dark:text-[#d7ff00]",
    button:
      "bg-[#ff4b12] text-white hover:-translate-y-0.5 hover:scale-105 dark:bg-[#d7ff00] dark:text-zinc-950",
    hoverRing: "hover:ring-2 hover:ring-[#ff4b12] dark:hover:ring-[#d7ff00]",
  },
  individual: {
    card: "bg-[#faf8ff] dark:bg-[#2d1b3d]",
    number: "text-[#7c3aed]/15 dark:text-[#a78bfa]/15",
    check: "text-[#1a4dff] dark:text-[#7d9bff]",
    iconBox: "bg-[#1a4dff] dark:bg-[#1a2a5e]",
    iconClass: "text-white dark:text-[#7d9bff]",
    button:
      "bg-zinc-950 text-white hover:-translate-y-0.5 hover:scale-105 dark:bg-white dark:text-zinc-950",
    hoverRing: "hover:ring-2 hover:ring-[#1a4dff] dark:hover:ring-[#7d9bff]",
  },
  business: {
    card: "bg-white dark:bg-[#1c1c1c]",
    number: "text-zinc-200 dark:text-zinc-700",
    check: "text-[#7c3aed] dark:text-[#a78bfa]",
    iconBox: "bg-[#ecdcff] dark:bg-[#2a1e3d]",
    iconClass: "text-[#7c3aed] dark:text-[#a78bfa]",
    button:
      "bg-[#7c3aed] text-white hover:-translate-y-0.5 hover:scale-105 dark:bg-[#a78bfa] dark:text-zinc-950",
    hoverRing: "hover:ring-2 hover:ring-[#7c3aed] dark:hover:ring-[#a78bfa]",
  },
} satisfies Record<string, OfferCardTheme>;

export const offerCards: OfferCardData[] = [
  {
    id: "courses",
    number: "01",
    title: "Kursy",
    features: [
      "Praktyczna wiedza w przystępnej formie",
      "Krok po kroku, bez technobełkotu",
      "Uczysz się we własnym tempie",
      "Dostęp od ręki po zakupie",
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
      "Nauka 1:1 — tylko Ty i Twoje potrzeby",
      "Tempo dostosowane do Ciebie",
      "Pełne wsparcie i cierpliwość",
      "Bez presji, bez oceniania",
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
      "AI dla małych i średnich firm",
      "Automatyzacja procesów biznesowych",
      "Realne oszczędności czasu i pieniędzy",
      "Wdrożenie dostosowane do Twojej branży",
    ],
    ctaLabel: "Porozmawiajmy",
    ctaType: "link",
    ctaHref: `#${OFFER_CONTACT_SECTION_ID}`,
    iconKey: OFFER_CARD_ICON.BUILDING,
    theme: THEME.business,
  },
];
