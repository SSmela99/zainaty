import { PATHS } from "@/lib/paths";

export const authPageContent = {
  login: {
    title: "Zaloguj się",
    description: "Witaj ponownie! Zaloguj się, by zobaczyć swoje kursy.",
    submitLabel: "Zaloguj się",
    switchPrompt: "Nie masz jeszcze konta?",
    switchAction: "Zarejestruj się",
    switchHref: PATHS.REGISTER,
    forgotPassword: "Zapomniałeś hasła?",
    firstPurchasePrompt: "Pierwsze logowanie po zakupie?",
    firstPurchaseAction: "Ustaw hasło",
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
  setPassword: {
    title: "Ustaw hasło",
    description:
      "Jesteś zalogowany. Ustaw hasło, aby uzyskać dostęp do kursów.",
    submitLabel: "Ustaw hasło i przejdź dalej",
    setupHint:
      "Link z maila zadziałał. Ustaw hasło, aby uzyskać dostęp do konta.",
    requestLinkTitle: "Ustaw hasło po zakupie",
    requestLinkDescription:
      "Wyślemy link na adres e-mail podany przy płatności. Kliknij go, aby ustawić hasło.",
    requestLinkHint:
      "Użyj tego samego adresu e-mail, który podałeś przy płatności w Stripe.",
    requestLinkSubmit: "Wyślij link do ustawienia hasła",
    setupLinkSent:
      "Jeśli konto na ten adres istnieje i wymaga ustawienia hasła, wysłaliśmy link. Sprawdź skrzynkę (również spam).",
    setupLinkError:
      "Link wygasł lub jest nieprawidłowy. Poproś o nowy link poniżej.",
    forgotPasswordPrompt: "Masz już hasło?",
    forgotPasswordAction: "Przypomnij hasło",
    switchPrompt: "Masz już hasło?",
    switchAction: "Zaloguj się",
    switchHref: PATHS.LOGIN,
  },
  forgotPassword: {
    title: "Przypomnij hasło",
    description:
      "Podaj e-mail konta. Wyślemy link do ustawienia nowego hasła.",
    submitLabel: "Wyślij link resetujący",
    switchPrompt: "Pamiętasz hasło?",
    switchAction: "Wróć do logowania",
    switchHref: PATHS.LOGIN,
  },
  resetPassword: {
    title: "Nowe hasło",
    description:
      "Jesteś zalogowany. Ustaw nowe hasło, aby przejść do konta i kursów.",
    submitLabel: "Zapisz nowe hasło",
    recoveryHint:
      "Link z maila zadziałał. Ustaw nowe hasło, aby uzyskać dostęp do konta.",
    wrongAccountPrompt: "To nie Twoje konto?",
    wrongAccountAction: "Wyloguj się i użyj innego e-maila",
  },
  sent: {
    title: "Sprawdź skrzynkę",
    description:
      "Wysłaliśmy link resetujący na podany adres e-mail. Kliknij go, aby ustawić nowe hasło.",
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
    passwordLabel: "Hasło",
    passwordPlaceholder: "••••••••",
    passwordConfirmLabel: "Powtórz hasło",
  },
  backHome: "Powrót na stronę główną",
  divider: "lub",
  errors: {
    generic: "Coś poszło nie tak. Spróbuj ponownie.",
    legalRequired: "Zaakceptuj politykę prywatności i regulamin, aby kontynuować.",
    emailRequired: "Podaj adres e-mail.",
    passwordRequired: "Podaj hasło.",
    invalidCredentials: "Nieprawidłowy e-mail lub hasło.",
    emailNotConfirmed:
      "Potwierdź adres e-mail przed logowaniem. Sprawdź skrzynkę odbiorczą.",
    userAlreadyRegistered:
      "Konto na ten adres już istnieje. Zaloguj się lub ustaw hasło, jeśli kupiłeś kurs bez rejestracji.",
    weakPassword: "Hasło jest zbyt słabe. Użyj co najmniej 8 znaków.",
    samePassword: "Nowe hasło musi różnić się od poprzedniego.",
    rateLimit: "Zbyt wiele prób. Spróbuj za chwilę.",
    smtp:
      "Nie udało się wysłać wiadomości e-mail. Spróbuj ponownie później.",
    notAuthenticated: "Sesja wygasła. Poproś o nowy link resetujący hasło.",
  },
} as const;

export function formatAuthErrorMessage(message: string | undefined): string {
  if (!message) {
    return authPageContent.errors.generic;
  }

  const normalized = message.toLowerCase();

  if (
    normalized.includes("rate limit") ||
    normalized.includes("email rate limit") ||
    normalized.includes("too many requests")
  ) {
    return authPageContent.errors.rateLimit;
  }

  if (
    normalized.includes("invalid login credentials") ||
    normalized.includes("invalid email or password")
  ) {
    return authPageContent.errors.invalidCredentials;
  }

  if (normalized.includes("email not confirmed")) {
    return authPageContent.errors.emailNotConfirmed;
  }

  if (
    normalized.includes("user already registered") ||
    normalized.includes("already been registered")
  ) {
    return authPageContent.errors.userAlreadyRegistered;
  }

  if (
    normalized.includes("password should be at least") ||
    normalized.includes("weak password")
  ) {
    return authPageContent.errors.weakPassword;
  }

  if (normalized.includes("same password")) {
    return authPageContent.errors.samePassword;
  }

  if (
    normalized.includes("sending recovery") ||
    normalized.includes("error sending")
  ) {
    return authPageContent.errors.smtp;
  }

  return message;
}

export function getPasswordResetCallbackUrl(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.origin}${PATHS.RESET_PASSWORD}`;
}
