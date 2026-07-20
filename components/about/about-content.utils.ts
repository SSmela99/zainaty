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
    border: "border-[#f24a00] dark:border-[#daff02]",
    background: "bg-[#fff4f0] dark:bg-[#3a4500]",
  },
  [ABOUT_QUOTE_VARIANT.BLUE]: {
    border: "border-[#0033ff] dark:border-[#6688ff]",
    background: "bg-[#dfe5ff] dark:bg-[#1a2a5e]",
  },
} as const;
