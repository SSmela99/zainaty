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
    box: "bg-[#ffe1cc] dark:bg-[#3a1f0e]",
    icon: "text-[#ff4b12]",
    boxHover: "group-hover:bg-[#ff4b12] dark:group-hover:bg-[#ff4b12]",
    iconHover:
      "group-hover:text-[#ffe1cc] dark:group-hover:text-[#3a1f0e]",
  },
  blue: {
    box: "bg-[#1a4dff]",
    icon: "text-white",
    boxHover: "group-hover:bg-white dark:group-hover:bg-white",
    iconHover: "group-hover:text-[#1a4dff] dark:group-hover:text-[#1a4dff]",
  },
  lavender: {
    box: "bg-[#ecdcff] dark:bg-[#2a1e3d]",
    icon: "text-[#7c3aed] dark:text-[#a78bfa]",
    boxHover:
      "group-hover:bg-[#7c3aed] dark:group-hover:bg-[#a78bfa]",
    iconHover:
      "group-hover:text-[#ecdcff] dark:group-hover:text-[#2a1e3d]",
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
      "Jeśli komputer wciąż bywa zagadką — jesteś w dobrym miejscu.",
  },
  {
    id: "freelancers",
    Icon: BriefcaseIcon,
    palette: PALETTE.blue,
    title: "Dla pracowników i freelancerów",
    description: "Oszczędzaj czas. Pracuj mądrzej.",
  },
  {
    id: "businesses",
    Icon: BarChart3Icon,
    palette: PALETTE.lavender,
    title: "Dla firm i MŚP",
    description: "AI, która naprawdę działa w biznesie.",
  },
  {
    id: "teachers-parents",
    Icon: UsersIcon,
    palette: PALETTE.lavender,
    title: "Dla nauczycieli i rodziców",
    description: "Technologia, która wspiera, nie zastępuje.",
  },
];
