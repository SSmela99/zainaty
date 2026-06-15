import { CircleHelpIcon, NewspaperIcon, PanelBottomIcon, type LucideIcon } from "lucide-react";

export const adminSections = [
  {
    id: "blog",
    label: "Blog",
    description: "Artykuły i wpisy blogowe.",
    icon: NewspaperIcon,
  },
  {
    id: "faq",
    label: "FAQ",
    description: "Najczęściej zadawane pytania.",
    icon: CircleHelpIcon,
  },
  {
    id: "footer",
    label: "Stopka",
    description: "Opis marki, linki social media i dane kontaktowe.",
    icon: PanelBottomIcon,
  },
] as const;

export type AdminSectionId = (typeof adminSections)[number]["id"];

export type AdminSection = {
  id: AdminSectionId;
  label: string;
  description: string;
  icon: LucideIcon;
};

export function getAdminSection(id: AdminSectionId) {
  return adminSections.find((section) => section.id === id) ?? adminSections[0];
}

function sidebarRevealClass(collapsed: boolean) {
  return `overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin] duration-300 ease-out ${
    collapsed ? "max-w-0 opacity-0" : "max-w-40 opacity-100"
  }`;
}

export { sidebarRevealClass };
