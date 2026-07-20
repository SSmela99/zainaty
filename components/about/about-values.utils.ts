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
      box: "bg-[#ffd0bc] dark:bg-[#3a4500]",
      icon: "text-[#f24a00] dark:text-[#daff02]",
      boxHover:
        "group-hover:bg-[#f24a00] dark:group-hover:bg-[#daff02]",
      iconHover:
        "group-hover:text-[#ffd0bc] dark:group-hover:text-[#3a4500]",
    },
  },
  {
    id: "simplicity",
    iconKey: ABOUT_VALUE_ICON.LIGHTBULB,
    title: "Prostota",
    description:
      "Skomplikowane rzeczy potrafimy wyjaśnić w prosty sposób. Bez zbędnego żargonu i technicznych zawiłości.",
    palette: {
      box: "bg-[#0033ff] dark:bg-[#1a2a5e]",
      icon: "text-white dark:text-[#6688ff]",
      boxHover:
        "group-hover:bg-white dark:group-hover:bg-[#6688ff]",
      iconHover:
        "group-hover:text-[#0033ff] dark:group-hover:text-[#1a2a5e]",
    },
  },
  {
    id: "support",
    iconKey: ABOUT_VALUE_ICON.HAND_HEART,
    title: "Wsparcie",
    description:
      "Nie zostawiamy Cię samego. Jesteśmy tu, by odpowiedzieć na pytania i pomóc w każdym kroku.",
    palette: {
      box: "bg-[#ddcfde] dark:bg-[#2a1230]",
      icon: "text-[#6b1cb1] dark:text-[#b57ae0]",
      boxHover:
        "group-hover:bg-[#6b1cb1] dark:group-hover:bg-[#b57ae0]",
      iconHover:
        "group-hover:text-[#ddcfde] dark:group-hover:text-[#2a1230]",
    },
  },
  {
    id: "practicality",
    iconKey: ABOUT_VALUE_ICON.ROCKET,
    title: "Praktyczność",
    description:
      "Uczymy tego, co naprawdę się przyda. Koncentruemy się na praktycznych umiejętnościach, nie suchej teorii.",
    palette: {
      box: "bg-[#ddcfde] dark:bg-[#2a1230]",
      icon: "text-[#6b1cb1] dark:text-[#b57ae0]",
      boxHover:
        "group-hover:bg-[#6b1cb1] dark:group-hover:bg-[#b57ae0]",
      iconHover:
        "group-hover:text-[#ddcfde] dark:group-hover:text-[#2a1230]",
    },
  },
];
