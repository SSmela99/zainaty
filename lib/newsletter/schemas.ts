import * as yup from "yup";

import { NEWSLETTER_SOURCE } from "./constants";

export const newsletterSubscribeSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Podaj poprawny adres e-mail.")
    .required("E-mail jest wymagany."),
  source: yup
    .string()
    .oneOf(Object.values(NEWSLETTER_SOURCE))
    .required("Brak źródła zapisu."),
});

export type NewsletterSubscribeInput = yup.InferType<
  typeof newsletterSubscribeSchema
>;
