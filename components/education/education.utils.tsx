type EducationListItem = {
  id: string;
  title: string;
  description: string;
};

export const educationListItems: EducationListItem[] = [
  {
    id: "courses",
    title: "Kursy i warsztaty online",
    description: "nauka w Twoim tempie, bez stresu",
  },
  {
    id: "ebooks",
    title: "Praktyczne e-booki",
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
    bg: "bg-[#ffe1cc] dark:bg-[#3a3d10]",
    value: "text-[#ff4b12] dark:text-[#d7ff00]",
    label: "text-[#ff4b12]/70 dark:text-[#d7ff00]/70",
  },
  blue: {
    bg: "bg-[#dfe5ff] dark:bg-[#1a2a5e]",
    value: "text-[#1a4dff] dark:text-[#7d9bff]",
    label: "text-[#1a4dff]/70 dark:text-[#7d9bff]/70",
  },
  purple: {
    bg: "bg-[#ecdcff] dark:bg-[#2a1e3d]",
    value: "text-[#7c3aed] dark:text-[#a78bfa]",
    label: "text-[#7c3aed]/70 dark:text-[#a78bfa]/70",
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
