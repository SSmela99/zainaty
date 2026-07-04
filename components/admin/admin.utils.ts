import { BookOpenIcon, CalendarIcon, CircleHelpIcon, MessageSquareQuoteIcon, NewspaperIcon, PanelBottomIcon, UsersIcon, type LucideIcon } from "lucide-react";

export const adminSections = [
  {
    id: "blog",
    label: "Blog",
    description: "Artykuły i wpisy blogowe.",
    icon: NewspaperIcon,
  },
  {
    id: "courses",
    label: "Kursy",
    description: "E-booki i kursy — okładka, opis, ceny i szczegóły produktu.",
    icon: BookOpenIcon,
  },
  {
    id: "faq",
    label: "FAQ",
    description: "Najczęściej zadawane pytania.",
    icon: CircleHelpIcon,
  },
  {
    id: "testimonials",
    label: "Opinie",
    description: "Opinie uczniów wyświetlane na stronie głównej.",
    icon: MessageSquareQuoteIcon,
  },
  {
    id: "consultations",
    label: "Konsultacje",
    description: "Rezerwacje terminów i wykluczenia dostępności.",
    icon: CalendarIcon,
  },
  {
    id: "footer",
    label: "Stopka",
    description: "Opis marki, linki social media i dane kontaktowe.",
    icon: PanelBottomIcon,
  },
  {
    id: "users",
    label: "Użytkownicy",
    description: "Lista wszystkich kont zarejestrowanych w serwisie.",
    icon: UsersIcon,
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

export const adminContentClassName = "mx-auto w-full max-w-6xl";

export const adminSectionBodyClassName = "mt-10 space-y-6";

export const ADMIN_PANEL_MAIN_ID = "admin-panel-main";

export function scrollAdminPanelToTop(behavior: ScrollBehavior = "smooth") {
  if (typeof document === "undefined") {
    return;
  }

  const main = document.getElementById(ADMIN_PANEL_MAIN_ID);

  if (main) {
    main.scrollTo({ top: 0, behavior });
    return;
  }

  window.scrollTo({ top: 0, behavior });
}

function sidebarRevealClass(collapsed: boolean) {
  return `overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin] duration-300 ease-out ${
    collapsed ? "max-w-0 opacity-0" : "max-w-40 opacity-100"
  }`;
}

export { sidebarRevealClass };
