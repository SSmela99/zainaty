import * as yup from "yup";

import type { FooterSettingsFormInput } from "@/lib/footer/types";

const optionalUrl = yup
  .string()
  .trim()
  .default("")
  .test("valid-url", "Podaj poprawny adres URL (https://...).", (value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  });

export type FooterSettingsFormValues = FooterSettingsFormInput;

export const footerSettingsSchema: yup.ObjectSchema<FooterSettingsFormValues> =
  yup.object({
    description: yup.string().trim().required("Opis jest wymagany."),
    social_facebook: optionalUrl,
    social_instagram: optionalUrl,
    social_linkedin: optionalUrl,
    social_youtube: optionalUrl,
    contact_line_1: yup.string().trim().defined(),
    contact_line_2: yup.string().trim().defined(),
    contact_line_3: yup.string().trim().defined(),
    contact_line_4: yup.string().trim().defined(),
  });
