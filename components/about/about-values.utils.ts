export const aboutValuesContent = {
  label: "Wartości",
  title: "Nasze",
  titleAccent: "wartości",
} as const;

export const ABOUT_VALUE_ICON = {
  HEART: "heart",
  LIGHTBULB: "lightbulb",
  HAND_HEART: "hand-heart",
  ROCKET: "rocket",
} as const;

export type AboutValueIcon =
  (typeof ABOUT_VALUE_ICON)[keyof typeof ABOUT_VALUE_ICON];

export type AboutValuePalette = {
  box: string;
  icon: string;
  boxHover: string;
  iconHover: string;
};

export type AboutValueCard = {
  id: string;
  iconKey: AboutValueIcon;
  title: string;
  description: string;
  palette: AboutValuePalette;
};

export const aboutValueCards: AboutValueCard[] = [
  {
    id: "empathy",
    iconKey: ABOUT_VALUE_ICON.HEART,
    title: "Empatia",
    description:
      "Rozumiemy, że nauka nowych rzeczy może być stresująca. Dlatego podchodzimy do każdego z cierpliwością i szacunkiem.",
    palette: {
      box: "bg-[#ffe1cc] dark:bg-[#3a3d10]",
      icon: "text-[#ff4b12] dark:text-[#d7ff00]",
      boxHover:
        "group-hover:bg-[#ff4b12] dark:group-hover:bg-[#d7ff00]",
      iconHover:
        "group-hover:text-[#ffe1cc] dark:group-hover:text-[#3a3d10]",
    },
  },
  {
    id: "simplicity",
    iconKey: ABOUT_VALUE_ICON.LIGHTBULB,
    title: "Prostota",
    description:
      "Skomplikowane rzeczy potrafimy wyjaśnić w prosty sposób. Bez zbędnego żargonu i technicznych zawiłości.",
    palette: {
      box: "bg-[#1a4dff] dark:bg-[#1a2a5e]",
      icon: "text-white dark:text-[#7d9bff]",
      boxHover:
        "group-hover:bg-white dark:group-hover:bg-[#7d9bff]",
      iconHover:
        "group-hover:text-[#1a4dff] dark:group-hover:text-[#1a2a5e]",
    },
  },
  {
    id: "support",
    iconKey: ABOUT_VALUE_ICON.HAND_HEART,
    title: "Wsparcie",
    description:
      "Nie zostawiamy Cię samego. Jesteśmy tu, by odpowiedzieć na pytania i pomóc w każdym kroku.",
    palette: {
      box: "bg-[#ecdcff] dark:bg-[#2a1e3d]",
      icon: "text-[#7c3aed] dark:text-[#a78bfa]",
      boxHover:
        "group-hover:bg-[#7c3aed] dark:group-hover:bg-[#a78bfa]",
      iconHover:
        "group-hover:text-[#ecdcff] dark:group-hover:text-[#2a1e3d]",
    },
  },
  {
    id: "practicality",
    iconKey: ABOUT_VALUE_ICON.ROCKET,
    title: "Praktyczność",
    description:
      "Uczymy tego, co naprawdę się przyda. Koncentruemy się na praktycznych umiejętnościach, nie suchej teorii.",
    palette: {
      box: "bg-[#ecdcff] dark:bg-[#2a1e3d]",
      icon: "text-[#7c3aed] dark:text-[#a78bfa]",
      boxHover:
        "group-hover:bg-[#7c3aed] dark:group-hover:bg-[#a78bfa]",
      iconHover:
        "group-hover:text-[#ecdcff] dark:group-hover:text-[#2a1e3d]",
    },
  },
];
