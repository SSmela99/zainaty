import { getNotifyEmail } from "./get-notify-email";
import { buildNotificationEmailHtml } from "./notification-email-layout";
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

  const html = buildNotificationEmailHtml({
    title: "Nowa wiadomość z oferty",
    badge: "Oferta",
    preheader: `${input.name} wysłał wiadomość z formularza /oferta`,
    intro: "Pojawiła się nowa wiadomość z formularza kontaktowego na stronie oferty.",
    fields: [
      { label: "Imię i nazwisko", value: input.name },
      {
        label: "E-mail",
        value: input.email,
        href: `mailto:${input.email}`,
      },
      { label: "Telefon", value: phone },
    ],
    messageLabel: "Treść wiadomości",
    message,
  });

  await sendEmail({
    to: [{ email: notifyEmail, name: "Z AI na Ty" }],
    subject,
    text,
    html,
    replyTo: { email: input.email, name: input.name },
  });
}
