import { PATHS } from "@/lib/paths";

export const authPageContent = {
  login: {
    title: "Zaloguj się",
    description: "Witaj ponownie! Zaloguj się, by zobaczyć swoje kursy.",
    submitLabel: "Zaloguj się",
    switchPrompt: "Nie masz jeszcze konta?",
    switchAction: "Zarejestruj się",
    switchHref: PATHS.REGISTER,
  },
  register: {
    title: "Załóż konto",
    description: "Dołącz do społeczności i zacznij naukę już dziś.",
    submitLabel: "Załóż konto",
    switchPrompt: "Masz już konto?",
    switchAction: "Zaloguj się",
    switchHref: PATHS.LOGIN,
    legalPrefix: "Akceptuję",
    privacyLabel: "politykę prywatności",
    termsLabel: "regulamin",
    legalJoiner: "i",
  },
  sent: {
    title: "Sprawdź skrzynkę",
    description:
      "Wysłaliśmy link na podany adres e-mail. Kliknij go, aby dokończyć logowanie.",
  },
  account: {
    title: "Twoje konto",
    description: "Jesteś zalogowany.",
    logoutLabel: "Wyloguj się",
    coursesLabel: "Zobacz kursy",
  },
  fields: {
    emailLabel: "E-mail",
    emailPlaceholder: "twoj@email.pl",
  },
  backHome: "Powrót na stronę główną",
  divider: "lub",
  errors: {
    generic: "Nie udało się wysłać linku. Spróbuj ponownie.",
    legalRequired: "Zaakceptuj politykę prywatności i regulamin, aby kontynuować.",
    emailRequired: "Podaj adres e-mail.",
    smtp:
      "Supabase nie wysłał maila (błąd SMTP). Sprawdź ustawienia Brevo w Supabase → Authentication → SMTP.",
    rateLimit: "Limit wysyłki maili został przekroczony. Spróbuj za chwilę.",
    userNotFound:
      "Nie ma konta na ten adres. Użyj rejestracji albo najpierw utwórz konto.",
  },
} as const;

export function formatAuthErrorMessage(message: string | undefined): string {
  if (!message) {
    return authPageContent.errors.generic;
  }

  const normalized = message.toLowerCase();

  if (
    normalized.includes("rate limit") ||
    normalized.includes("email rate limit")
  ) {
    return authPageContent.errors.rateLimit;
  }

  if (
    normalized.includes("sending confirmation") ||
    normalized.includes("sending magic link") ||
    normalized.includes("error sending")
  ) {
    return authPageContent.errors.smtp;
  }

  if (
    normalized.includes("signups not allowed") ||
    normalized.includes("user not found")
  ) {
    return authPageContent.errors.userNotFound;
  }

  return message;
}

export function getAuthCallbackUrl(nextPath = "/"): string {
  if (typeof window === "undefined") {
    return "";
  }

  const next = nextPath.startsWith("/") ? nextPath : PATHS.HOME;
  const params = new URLSearchParams({ next });
  return `${window.location.origin}/auth/callback?${params.toString()}`;
}
