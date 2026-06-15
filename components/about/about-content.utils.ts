export const ABOUT_QUOTE_VARIANT = {
  ORANGE: "orange",
  BLUE: "blue",
} as const;

export type AboutQuoteVariant =
  (typeof ABOUT_QUOTE_VARIANT)[keyof typeof ABOUT_QUOTE_VARIANT];

export type AboutQuote = {
  id: string;
  text: string;
  variant: AboutQuoteVariant;
};

export const aboutQuotes = [
  {
    id: "support",
    text: "Nie oceniamy — wspieramy. Nie przyspieszamy — dostosowujemy się do Twojego tempa.",
    variant: ABOUT_QUOTE_VARIANT.ORANGE,
  },
  {
    id: "pace",
    text: "Bo każdy kiedyś zaczynał. I każdy ma prawo uczyć się we własnym tempie.",
    variant: ABOUT_QUOTE_VARIANT.BLUE,
  },
] as const satisfies readonly AboutQuote[];

export const aboutQuoteStyles = {
  [ABOUT_QUOTE_VARIANT.ORANGE]: {
    border: "border-[#ff4b12] dark:border-[#d7ff00]",
    background: "bg-[#fff5ef] dark:bg-[#3a3d10]",
  },
  [ABOUT_QUOTE_VARIANT.BLUE]: {
    border: "border-[#1a4dff] dark:border-[#7d9bff]",
    background: "bg-[#dfe5ff] dark:bg-[#1a2a5e]",
  },
} as const;
