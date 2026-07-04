import { formatBookingDate } from "@/lib/consultations/format";
import type { ConsultationBooking } from "@/lib/consultations/types";

import { escapeHtml } from "./escape-html";
import { getNotifyEmail } from "./get-notify-email";
import { sendEmail } from "./send-email";

export async function sendConsultationBookingNotification(
  booking: ConsultationBooking,
): Promise<void> {
  const notifyEmail = getNotifyEmail();

  if (!notifyEmail) {
    console.warn(
      "[mailersend] CONTACT_NOTIFY_EMAIL / CONSULTATION_NOTIFY_EMAIL nie jest ustawione — pomijam powiadomienie.",
    );
    return;
  }

  const dateLabel = formatBookingDate(booking.scheduled_date);
  const phone = booking.phone?.trim() || "—";
  const message = booking.message?.trim() || "—";

  const subject = `Nowa rezerwacja konsultacji — ${booking.name} — ${dateLabel}, ${booking.scheduled_time}`;

  const text = [
    "Nowa rezerwacja konsultacji na stronie zainaty.pl",
    "",
    `Imię i nazwisko: ${booking.name}`,
    `E-mail: ${booking.email}`,
    `Telefon: ${phone}`,
    `Termin: ${dateLabel}, godz. ${booking.scheduled_time}`,
    "",
    "Wiadomość:",
    message,
  ].join("\n");

  const html = `
    <h2>Nowa rezerwacja konsultacji</h2>
    <p><strong>Imię i nazwisko:</strong> ${escapeHtml(booking.name)}</p>
    <p><strong>E-mail:</strong> <a href="mailto:${escapeHtml(booking.email)}">${escapeHtml(booking.email)}</a></p>
    <p><strong>Telefon:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Termin:</strong> ${escapeHtml(dateLabel)}, godz. ${escapeHtml(booking.scheduled_time)}</p>
    <p><strong>Wiadomość:</strong></p>
    <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
  `.trim();

  await sendEmail({
    to: [{ email: notifyEmail, name: "Z AI na Ty" }],
    subject,
    text,
    html,
    replyTo: { email: booking.email, name: booking.name },
  });
}
