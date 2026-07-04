import { PATHS } from "@/lib/paths";

export const ACCOUNT_TABS = [
  { id: "courses" as const, label: "Kursy" },
] as const;

export type AccountTabId = (typeof ACCOUNT_TABS)[number]["id"];

export const accountPageContent = {
  title: "Twoje konto",
  logoutLabel: "Wyloguj się",
  loggingOutLabel: "Wylogowywanie...",
  courses: {
    emptyTitle: "Brak kursów",
    emptyDescription:
      "Nie masz jeszcze dostępu do żadnego kursu. Przejrzyj ofertę i wybierz kurs dla siebie.",
    browseLabel: "Zobacz kursy",
    browseHref: PATHS.COURSES,
    filesHeading: "Materiały do pobrania",
    noFiles: "Brak plików w tym kursie.",
    purchasedAt: "Dostęp od",
  },
  fileTypes: {
    pdf: "PDF",
    video: "Wideo",
  },
  download: {
    label: "Pobierz",
    loading: "Generowanie linku...",
    error: "Nie udało się wygenerować linku do pobrania.",
  },
} as const;
