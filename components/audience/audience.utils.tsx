import {
  BarChart3Icon,
  BriefcaseIcon,
  type LucideIcon,
  SmileIcon,
  UsersIcon,
} from "lucide-react";

type IconPalette = {
  box: string;
  icon: string;
  boxHover: string;
  iconHover: string;
};

const PALETTE = {
  peach: {
    box: "bg-[#ffd0bc] dark:bg-[#3a1f0e]",
    icon: "text-[#f24a00]",
    boxHover: "group-hover:bg-[#f24a00] dark:group-hover:bg-[#f24a00]",
    iconHover:
      "group-hover:text-[#ffd0bc] dark:group-hover:text-[#3a1f0e]",
  },
  blue: {
    box: "bg-[#0033ff]",
    icon: "text-white",
    boxHover: "group-hover:bg-white dark:group-hover:bg-white",
    iconHover: "group-hover:text-[#0033ff] dark:group-hover:text-[#0033ff]",
  },
  lavender: {
    box: "bg-[#ddcfde] dark:bg-[#2a1230]",
    icon: "text-[#6b1cb1] dark:text-[#b57ae0]",
    boxHover:
      "group-hover:bg-[#6b1cb1] dark:group-hover:bg-[#b57ae0]",
    iconHover:
      "group-hover:text-[#ddcfde] dark:group-hover:text-[#2a1230]",
  },
} satisfies Record<string, IconPalette>;

type AudienceCard = {
  id: string;
  Icon: LucideIcon;
  palette: IconPalette;
  title: string;
  description: string;
};

export const audienceCards: AudienceCard[] = [
  {
    id: "beginners",
    Icon: SmileIcon,
    palette: PALETTE.peach,
    title: "Dla początkujących",
    description:
      "Jeśli komputer wciąż bywa dla Ciebie zagadką, jesteś w dobrym miejscu.",
  },
  {
    id: "schools",
    Icon: BriefcaseIcon,
    palette: PALETTE.blue,
    title: "Dla szkół i instytucji publicznych",
    description:
      "Szkolenia dla całych zespołów, nauczycieli, urzędników, bibliotekarzy.",
  },
  {
    id: "businesses",
    Icon: BarChart3Icon,
    palette: PALETTE.lavender,
    title: "Dla mikro i małych przedsiębiorstw",
    description:
      "Pokażemy Ci jak AI może odciążyć Cię w codziennych, powtarzalnych obowiązkach.",
  },
  {
    id: "teachers-parents",
    Icon: UsersIcon,
    palette: PALETTE.lavender,
    title: "Dla nauczycieli i rodziców",
    description:
      "Praktyczne wsparcie w pracy z dziećmi i uczniami, na co dzień.",
  },
];
