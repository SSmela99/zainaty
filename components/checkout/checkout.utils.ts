export const checkoutContent = {
  pageTitle: "Finalizacja zakupu",
  pageDescription:
    "Nie musisz mieć konta — podaj e-mail przy płatności, a dostęp wyślemy od razu po opłaceniu.",
  paymentCardTitle: "Płatność",
  orderTitle: "Twoje zamówienie",
  productPriceLabel: "Cena produktu",
  vatLabel: "VAT (23%)",
  totalLabel: "Razem",
  grossNote: "Cena brutto — płatność jednorazowa",
  legalPrefix: "Akceptuję",
  privacyLabel: "politykę prywatności",
  termsLabel: "regulamin",
  legalJoiner: "i",
  legalSuffix:
    "Wyrażam zgodę na przetwarzanie danych osobowych w celu realizacji zamówienia.",
  stripeNote: "Płatność przez Stripe (karta, BLIK, Apple Pay).",
  accessInfoTitle: "Jak działa dostęp do kursu",
  accessInfo:
    "Jeśli jesteś zalogowany, po płatności kurs pojawi się od razu na Twoim koncie. Jeśli nie masz konta, podajesz e-mail przy płatności — na jego podstawie utworzymy dostęp i wyślemy link do ustawienia hasła.",
  businessPurchaseLabel: "Kupuję na firmę — chcę fakturę VAT",
  businessPurchaseHint:
    "Na stronie płatności Stripe podasz nazwę firmy, NIP i adres. Faktura PDF trafi na ten sam e-mail po opłaceniu.",
  payButton: (priceLabel: string) => `Zapłać ${priceLabel}`,
  errors: {
    legalRequired:
      "Zaakceptuj regulamin i politykę prywatności, aby kontynuować.",
    paymentFailed: "Nie udało się rozpocząć płatności. Spróbuj ponownie.",
  },
  trust: [
    {
      title: "Bezpieczna płatność",
      description: "Szyfrowane połączenie Stripe",
    },
    {
      title: "Natychmiastowy dostęp",
      description: "Materiały od razu na koncie",
    },
    {
      title: "14 dni na zwrot",
      description: "Zgodnie z regulaminem",
    },
  ],
} as const;
