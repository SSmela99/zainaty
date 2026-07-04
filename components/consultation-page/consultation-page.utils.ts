import type { LucideIcon } from "lucide-react";
import { ClockIcon, ShieldCheckIcon, VideoIcon } from "lucide-react";

export {
  consultationMonthNames,
  consultationTimeSlots,
  consultationWeekdays,
  formatSelectedSlot,
  getCalendarMonthDays,
  isConsultationDayAvailable,
  isPastCalendarDay,
  isSameCalendarDay,
} from "@/lib/consultations";

export const consultationPageHero = {
  label: "Bezpłatna konsultacja",
  title: "Porozmawiajmy",
  titleAccent: "o Tobie",
  description:
    "30 minut, zero zobowiązań. Wybierz termin, który Ci odpowiada — i razem znajdziemy najlepsze rozwiązanie dla Twoich potrzeb.",
} as const;

export type ConsultationFeature = {
  id: string;
  Icon: LucideIcon;
  title: string;
  description: string;
  palette: {
    box: string;
    icon: string;
  };
};

export const consultationFeatures: ConsultationFeature[] = [
  {
    id: "duration",
    Icon: ClockIcon,
    title: "30 minut",
    description: "Koncentrujemy się na tym, co najważniejsze dla Ciebie.",
    palette: {
      box: "bg-[#ffe8dc] dark:bg-[#3a2218]",
      icon: "text-[#ff4b12] dark:text-[#ff8a5c]",
    },
  },
  {
    id: "free",
    Icon: ShieldCheckIcon,
    title: "Całkowicie bezpłatna",
    description: "Żadnych ukrytych kosztów, żadnych zobowiązań.",
    palette: {
      box: "bg-[#dfe5ff] dark:bg-[#1a2a5e]",
      icon: "text-[#1a4dff] dark:text-[#7d9bff]",
    },
  },
  {
    id: "online",
    Icon: VideoIcon,
    title: "Online",
    description: "Rozmowa przez Google Meet lub Zoom — z dowolnego miejsca.",
    palette: {
      box: "bg-[#ede5ff] dark:bg-[#2a1f4a]",
      icon: "text-[#7c3aed] dark:text-[#a78bfa]",
    },
  },
];
