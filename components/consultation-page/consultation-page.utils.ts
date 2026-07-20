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
      box: "bg-[#ffdccf] dark:bg-[#3a2218]",
      icon: "text-[#f24a00] dark:text-[#ff7a40]",
    },
  },
  {
    id: "free",
    Icon: ShieldCheckIcon,
    title: "Całkowicie bezpłatna",
    description: "Żadnych ukrytych kosztów, żadnych zobowiązań.",
    palette: {
      box: "bg-[#dfe5ff] dark:bg-[#1a2a5e]",
      icon: "text-[#0033ff] dark:text-[#6688ff]",
    },
  },
  {
    id: "online",
    Icon: VideoIcon,
    title: "Online",
    description: "Rozmowa przez Google Meet lub Zoom — z dowolnego miejsca.",
    palette: {
      box: "bg-[#ddcfde] dark:bg-[#2a1f4a]",
      icon: "text-[#6b1cb1] dark:text-[#b57ae0]",
    },
  },
];
