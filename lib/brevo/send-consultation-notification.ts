import { formatBookingDate } from "@/lib/consultations/format";
import type { ConsultationBooking } from "@/lib/consultations/types";

import { getNotifyEmail } from "./get-notify-email";
import { buildNotificationEmailHtml } from "./notification-email-layout";
import { sendEmail } from "./send-email";

export async function sendConsultationBookingNotification(
  booking: ConsultationBooking,
): Promise<void> {
  const notifyEmail = getNotifyEmail();

  if (!notifyEmail) {
    console.warn(
      "[brevo] CONTACT_NOTIFY_EMAIL / CONSULTATION_NOTIFY_EMAIL nie jest ustawione — pomijam powiadomienie.",
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

  const slotLabel = `${dateLabel}, godz. ${booking.scheduled_time}`;

  const html = buildNotificationEmailHtml({
    title: "Nowa rezerwacja konsultacji",
    badge: "Konsultacja",
    preheader: `${booking.name} — ${slotLabel}`,
    intro: "Ktoś właśnie zarezerwował termin konsultacji przez formularz na stronie.",
    highlight: {
      label: "Zarezerwowany termin",
      value: slotLabel,
    },
    fields: [
      { label: "Imię i nazwisko", value: booking.name },
      {
        label: "E-mail",
        value: booking.email,
        href: `mailto:${booking.email}`,
      },
      { label: "Telefon", value: phone },
    ],
    messageLabel: "Wiadomość od klienta",
    message: message === "—" ? undefined : message,
  });

  await sendEmail({
    to: [{ email: notifyEmail, name: "Z AI na Ty" }],
    subject,
    text,
    html,
    replyTo: { email: booking.email, name: booking.name },
  });
}
