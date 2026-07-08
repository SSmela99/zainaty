const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

type BrevoRecipient = {
  email: string;
  name?: string;
};

type SendEmailInput = {
  to: BrevoRecipient[];
  subject: string;
  text: string;
  html: string;
  replyTo?: BrevoRecipient;
};

type BrevoErrorResponse = {
  message?: string;
  code?: string;
};

function getBrevoConfig() {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const fromEmail = process.env.BREVO_FROM_EMAIL?.trim();
  const fromName = process.env.BREVO_FROM_NAME?.trim() || "Z AI na Ty";

  if (!apiKey || !fromEmail) {
    const missing = [
      !apiKey ? "BREVO_API_KEY" : null,
      !fromEmail ? "BREVO_FROM_EMAIL" : null,
    ].filter(Boolean);

    console.error(
      `[brevo] Brak konfiguracji na serwerze. Ustaw w hostingu: ${missing.join(", ")}`,
    );

    return null;
  }

  return { apiKey, fromEmail, fromName };
}

export function isBrevoConfigured(): boolean {
  return getBrevoConfig() !== null;
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const config = getBrevoConfig();

  if (!config) {
    throw new Error("Brak konfiguracji Brevo (BREVO_API_KEY, BREVO_FROM_EMAIL).");
  }

  const body: Record<string, unknown> = {
    sender: {
      email: config.fromEmail,
      name: config.fromName,
    },
    to: input.to.map((recipient) => ({
      email: recipient.email,
      name: recipient.name ?? recipient.email,
    })),
    subject: input.subject,
    textContent: input.text,
    htmlContent: input.html,
  };

  if (input.replyTo) {
    body.replyTo = {
      email: input.replyTo.email,
      name: input.replyTo.name ?? input.replyTo.email,
    };
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": config.apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as
      | BrevoErrorResponse
      | null;

    throw new Error(
      error?.message || "Nie udało się wysłać wiadomości e-mail.",
    );
  }
}
