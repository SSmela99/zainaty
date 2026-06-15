export const offerContactContent = {
  label: "Kontakt",
  title: "Skontaktuj się",
  titleAccent: "z nami",
  description: "Odpowiemy na wszystkie Twoje pytania",
  maxMessageLength: 500,
  maxMessageHint: "Maksymalnie 500 znaków",
  submitLabel: "Wyślij wiadomość",
} as const;

export const OFFER_CONTACT_SECTION_ID = "kontakt";
export const OFFER_CONTACT_SCROLL_OFFSET = -100;

export const offerContactFields = [
  {
    id: "name",
    name: "name",
    label: "Imię i nazwisko",
    type: "text",
    autoComplete: "name",
  },
  {
    id: "email",
    name: "email",
    label: "Email",
    type: "email",
    autoComplete: "email",
  },
] as const;
