"use server";

import * as yup from "yup";

import { sendOfferContactNotification } from "@/lib/brevo/send-offer-contact-notification";
import type { OfferContactFormValues } from "@/lib/validation/offer-contact.schemas";
import { offerContactSchema } from "@/lib/validation/offer-contact.schemas";

export type OfferContactActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function submitOfferContact(
  input: OfferContactFormValues,
): Promise<OfferContactActionResult> {
  try {
    const values = await offerContactSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    await sendOfferContactNotification({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone?.trim() || null,
      message: values.message.trim(),
    });

    return { ok: true };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { ok: false, error: error.errors[0] ?? error.message };
    }

    console.error("[offer-contact]", error);

    return {
      ok: false,
      error: "Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę.",
    };
  }
}
