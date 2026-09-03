type EducationListItem = {
  id: string;
  title: string;
  description: string;
};

export const educationListItems: EducationListItem[] = [
  {
    id: "courses",
    title: "Szkolenia i warsztaty online",
    description: "nauka w Twoim tempie",
  },
  {
    id: "ebooks",
    title: "Praktyczne treści",
    description: "konkretna wiedza, zero technobełkotu",
  },
  {
    id: "ai",
    title: "AI i automatyzacja",
    description: "wyjaśnione krok po kroku",
  },
  {
    id: "examples",
    title: "Przykłady z życia",
    description: "zamiast suchej teorii",
  },
];

type StatPalette = {
  bg: string;
  value: string;
  label: string;
};

const STAT_PALETTE = {
  amber: {
    bg: "bg-[#ffd0bc] dark:bg-[#3a4500]",
    value: "text-[#f24a00] dark:text-[#daff02]",
    label: "text-[#f24a00]/70 dark:text-[#daff02]/70",
  },
  blue: {
    bg: "bg-[#dfe5ff] dark:bg-[#1a2a5e]",
    value: "text-[#0033ff] dark:text-[#6688ff]",
    label: "text-[#0033ff]/70 dark:text-[#6688ff]/70",
  },
  purple: {
    bg: "bg-[#ddcfde] dark:bg-[#2a1230]",
    value: "text-[#6b1cb1] dark:text-[#b57ae0]",
    label: "text-[#6b1cb1]/70 dark:text-[#b57ae0]/70",
  },
} satisfies Record<string, StatPalette>;

type EducationStat = {
  id: string;
  value: string;
  label: string;
  palette: StatPalette;
};

export const educationStats: EducationStat[] = [
  {
    id: "ebooks-count",
    value: "10+",
    label: "E-booków",
    palette: STAT_PALETTE.amber,
  },
  {
    id: "students",
    value: "500+",
    label: "Uczniów",
    palette: STAT_PALETTE.blue,
  },
  {
    id: "satisfaction",
    value: "98%",
    label: "Zadowolonych",
    palette: STAT_PALETTE.purple,
  },
  {
    id: "availability",
    value: "24/7",
    label: "Dostęp",
    palette: STAT_PALETTE.purple,
  },
];
