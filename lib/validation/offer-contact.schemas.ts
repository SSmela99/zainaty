import { isValidPhoneNumber } from "libphonenumber-js";
import * as yup from "yup";

export type OfferContactFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export const offerContactSchema: yup.ObjectSchema<OfferContactFormValues> =
  yup.object({
    name: yup
      .string()
      .trim()
      .required("Imię i nazwisko jest wymagane.")
      .min(2, "Podaj pełne imię i nazwisko."),
    email: yup
      .string()
      .trim()
      .email("Podaj prawidłowy adres e-mail.")
      .required("Adres e-mail jest wymagany."),
    phone: yup
      .string()
      .trim()
      .test(
        "phone",
        "Podaj prawidłowy numer telefonu.",
        (value) => !value || isValidPhoneNumber(value),
      )
      .default(""),
    message: yup
      .string()
      .trim()
      .required("Wiadomość jest wymagana.")
      .min(10, "Wiadomość musi mieć co najmniej 10 znaków.")
      .max(500, "Wiadomość może mieć maksymalnie 500 znaków."),
  });
