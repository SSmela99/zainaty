import { PATHS } from "@/lib/paths";

export const ctaContent = {
  heading: "Gotowy, by",
  headingAccent: "zacząć?",
  description:
    "Wybierz e-book, który Cię interesuje i zacznij swoją przygodę z technologią już dziś.",
  primaryCta: {
    label: "Przeglądaj e-booki",
    href: PATHS.EBOOKS,
  },
  secondaryCta: {
    label: "Zobacz ofertę",
    href: PATHS.OFFER,
  },
} as const;
