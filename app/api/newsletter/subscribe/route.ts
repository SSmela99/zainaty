import { ValidationError } from "yup";

import { subscribeToMailerLite } from "@/lib/mailerlite/subscribe";
import { newsletterSubscribeSchema } from "@/lib/newsletter/schemas";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email, source } = await newsletterSubscribeSchema.validate(json, {
      abortEarly: false,
      stripUnknown: true,
    });

    await subscribeToMailerLite({ email, source });

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json(
        { error: error.errors[0] ?? "Nieprawidłowe dane formularza." },
        { status: 400 },
      );
    }

    console.error("[newsletter/subscribe]", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nie udało się zapisać do newslettera.",
      },
      { status: 500 },
    );
  }
}
