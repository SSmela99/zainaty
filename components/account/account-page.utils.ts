import { PATHS } from "@/lib/paths";

export const ACCOUNT_TABS = [
  { id: "courses" as const, label: "Kursy" },
] as const;

export type AccountTabId = (typeof ACCOUNT_TABS)[number]["id"];

export const accountPageContent = {
  title: "Twoje konto",
  logoutLabel: "Wyloguj się",
  loggingOutLabel: "Wylogowywanie...",
  deleteAccountLabel: "Usuń konto",
  deleteAccount: {
    title: "Usunąć konto?",
    description:
      "Ta operacja jest nieodwracalna. Stracisz dostęp do wszystkich zakupionych kursów i materiałów powiązanych z tym kontem.",
    passwordLabel: "Potwierdź hasłem",
    passwordHint: "Wpisz hasło do swojego konta, aby potwierdzić usunięcie.",
    passwordRequired: "Podaj hasło, aby potwierdzić usunięcie.",
    cancelLabel: "Anuluj",
    confirmLabel: "Usuń konto",
    deletingLabel: "Usuwanie...",
    success: "Konto zostało usunięte.",
  },
  courses: {
    emptyTitle: "Brak kursów",
    emptyDescription:
      "Nie masz jeszcze dostępu do żadnego kursu. Przejrzyj ofertę i wybierz kurs dla siebie.",
    browseLabel: "Zobacz kursy",
    browseHref: PATHS.COURSES,
    filesHeading: "Materiały do pobrania",
    noFiles: "Brak plików w tym kursie.",
    purchasedAt: "Dostęp od",
    openVideoCourse: "Przejdź do szkolenia wideo",
    backToCourses: "Wróć do kursów",
    videoPlayer: {
      emptyCurriculum: "Ten kurs nie ma jeszcze lekcji wideo.",
      loadingVideo: "Ładowanie wideo...",
      videoError: "Nie udało się załadować wideo.",
      selectLesson: "Wybierz lekcję z programu kursu.",
      speedLabel: "Prędkość",
    },
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
