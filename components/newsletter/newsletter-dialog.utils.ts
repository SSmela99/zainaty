export const NEWSLETTER_DIALOG_DELAY_MS = 30_000;

/** Szybszy popup na /darmowe-materialy - opcjonalny, bez blokowania pobierania. */
export const NEWSLETTER_DIALOG_FREE_MATERIALS_DELAY_MS = 2_500;

export const NEWSLETTER_DIALOG_STORAGE_KEY = "newsletter-dialog-subscribed";

export const newsletterDialogContent = {
  heading: "Nie przegap nowych artykułów!",
  description:
    "Dołącz do społeczności, która raz w miesiącu otrzymuje nowe artykuły o nowościach w AI. Bez technobełkotu.",
  placeholder: "Twój adres e-mail",
  submitLabel: "Zapisz się",
  disclaimer: "Zero spamu. Wypisz się w każdej chwili, jednym kliknięciem.",
} as const;

export const newsletterDialogFreeMaterialsContent = {
  heading: "Chcesz więcej takich materiałów?",
  description:
    "Zapisz się do newslettera - raz w miesiącu nowości o AI, bez spamu. Materiały i tak możesz przeglądać i pobierać za darmo.",
  placeholder: "Twój adres e-mail",
  submitLabel: "Zapisz się",
  disclaimer:
    "To tylko propozycja - zamknij okno, jeśli wolisz wrócić do materiałów. Zero spamu.",
} as const;
