import { isValidPhoneNumber } from "libphonenumber-js";
import * as yup from "yup";

import { consultationTimeSlots } from "@/lib/consultations/calendar";

export type ConsultationBookingFormValues = {
  name: string;
  email: string;
  phone: string;
  message: string;
  scheduledDate: string;
  scheduledTime: string;
};

export const consultationBookingSchema: yup.ObjectSchema<ConsultationBookingFormValues> =
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
      .max(500, "Wiadomość może mieć maksymalnie 500 znaków.")
      .default(""),
    scheduledDate: yup
      .string()
      .required("Wybierz dzień konsultacji."),
    scheduledTime: yup
      .string()
      .oneOf([...consultationTimeSlots], "Wybierz godzinę konsultacji.")
      .required("Wybierz godzinę konsultacji."),
  });
