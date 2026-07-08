import { escapeHtml } from "./escape-html";
import { getNotifyEmail } from "./get-notify-email";
import { sendEmail } from "./send-email";

export type OfferContactNotificationInput = {
  name: string;
  email: string;
  phone: string | null;
  message: string;
};

export async function sendOfferContactNotification(
  input: OfferContactNotificationInput,
): Promise<void> {
  const notifyEmail = getNotifyEmail();

  if (!notifyEmail) {
    console.warn(
      "[brevo] CONTACT_NOTIFY_EMAIL / CONSULTATION_NOTIFY_EMAIL nie jest ustawione — pomijam powiadomienie.",
    );
    return;
  }

  const phone = input.phone?.trim() || "—";
  const message = input.message.trim();

  const subject = `Nowa wiadomość z oferty — ${input.name}`;

  const text = [
    "Nowa wiadomość z formularza kontaktowego na stronie /oferta",
    "",
    `Imię i nazwisko: ${input.name}`,
    `E-mail: ${input.email}`,
    `Telefon: ${phone}`,
    "",
    "Wiadomość:",
    message,
  ].join("\n");

  const html = `
    <h2>Nowa wiadomość z oferty</h2>
    <p><strong>Imię i nazwisko:</strong> ${escapeHtml(input.name)}</p>
    <p><strong>E-mail:</strong> <a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a></p>
    <p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Wiadomość:</strong></p>
    <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
  `.trim();

  await sendEmail({
    to: [{ email: notifyEmail, name: "Z AI na Ty" }],
    subject,
    text,
    html,
    replyTo: { email: input.email, name: input.name },
  });
}
