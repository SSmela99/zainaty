const MAILERSEND_API_URL = "https://api.mailersend.com/v1/email";

type MailerSendRecipient = {
  email: string;
  name?: string;
};

type SendEmailInput = {
  to: MailerSendRecipient[];
  subject: string;
  text: string;
  html: string;
  replyTo?: MailerSendRecipient;
};

type MailerSendErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

function getMailerSendConfig() {
  const apiToken = process.env.MAILERSEND_API_TOKEN?.trim();
  const fromEmail = process.env.MAILERSEND_FROM_EMAIL?.trim();
  const fromName = process.env.MAILERSEND_FROM_NAME?.trim() || "Z AI na Ty";

  if (!apiToken || !fromEmail) {
    return null;
  }

  return { apiToken, fromEmail, fromName };
}

export function isMailerSendConfigured(): boolean {
  return getMailerSendConfig() !== null;
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const config = getMailerSendConfig();

  if (!config) {
    throw new Error("Brak konfiguracji MailerSend (MAILERSEND_API_TOKEN, MAILERSEND_FROM_EMAIL).");
  }

  const body: Record<string, unknown> = {
    from: {
      email: config.fromEmail,
      name: config.fromName,
    },
    to: input.to.map((recipient) => ({
      email: recipient.email,
      name: recipient.name ?? recipient.email,
    })),
    subject: input.subject,
    text: input.text,
    html: input.html,
  };

  if (input.replyTo) {
    body.reply_to = {
      email: input.replyTo.email,
      name: input.replyTo.name ?? input.replyTo.email,
    };
  }

  const response = await fetch(MAILERSEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as
      | MailerSendErrorResponse
      | null;

    const fieldErrors = error?.errors
      ? Object.values(error.errors).flat().join(" ")
      : "";

    throw new Error(
      fieldErrors || error?.message || "Nie udało się wysłać wiadomości e-mail.",
    );
  }
}
