import {
  buildConsultationEmailHtml,
  consultationDetailLine,
  consultationParagraph,
} from "./consultation-email-layout";
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
      "[brevo] CONTACT_NOTIFY_EMAIL / CONSULTATION_NOTIFY_EMAIL nie jest ustawione - pomijam powiadomienie.",
    );
    return;
  }

  const phone = input.phone?.trim() || "-";
  const message = input.message.trim();

  const emailLink = `<a href="mailto:${escapeHtml(input.email)}" style="color:#daff02;text-decoration:underline;">${escapeHtml(input.email)}</a>`;

  const bodyHtml = [
    consultationParagraph(
      "Nowa wiadomość z formularza kontaktowego na stronie /oferta.",
    ),
    consultationDetailLine("Imię i nazwisko", escapeHtml(input.name)),
    consultationDetailLine("E-mail", emailLink),
    consultationDetailLine("Telefon", escapeHtml(phone)),
    `<p style="margin:18px 0 8px;font-size:13px;font-weight:700;color:#a1a1aa;">Treść wiadomości</p>
     <p style="margin:0 0 24px;padding:14px 16px;border-radius:12px;background:#1c1c1c;border:1px solid #2a2a2a;font-size:15px;line-height:1.55;color:#ffffff;white-space:pre-wrap;">${escapeHtml(message)}</p>`,
  ].join("");

  const subject = `Nowa wiadomość z oferty - ${input.name}`;

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

  await sendEmail({
    to: [{ email: notifyEmail, name: "Z AI na Ty" }],
    subject,
    text,
    html: buildConsultationEmailHtml({
      title: "Nowa wiadomość z oferty",
      preheader: `${input.name} wysłał wiadomość z formularza /oferta`,
      bodyHtml,
    }),
    replyTo: { email: input.email, name: input.name },
  });
}
