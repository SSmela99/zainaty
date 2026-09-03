import { formatBookingDate } from "@/lib/consultations/format";
import { getConsultationMeetUrl } from "@/lib/consultations/meet";
import type { ConsultationBooking } from "@/lib/consultations/types";

import {
  buildConsultationEmailHtml,
  consultationDetailLine,
  consultationMeetSection,
  consultationParagraph,
} from "./consultation-email-layout";
import { escapeHtml } from "./escape-html";
import { getNotifyEmail } from "./get-notify-email";
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
  const timeLabel = booking.scheduled_time;
  const phone = booking.phone?.trim() || "—";
  const message = booking.message?.trim() || "";
  const meetUrl = getConsultationMeetUrl(booking);

  const emailLink = `<a href="mailto:${escapeHtml(booking.email)}" style="color:#daff02;text-decoration:underline;">${escapeHtml(booking.email)}</a>`;

  const bodyHtml = [
    consultationParagraph(
      "Nowa rezerwacja konsultacji właśnie wpłynęła przez formularz na stronie.",
    ),
    consultationDetailLine("Imię i nazwisko", escapeHtml(booking.name)),
    consultationDetailLine("E-mail", emailLink),
    consultationDetailLine("Telefon", escapeHtml(phone)),
    consultationDetailLine("Data", escapeHtml(dateLabel)),
    consultationDetailLine("Godzina", escapeHtml(timeLabel)),
    meetUrl ? consultationMeetSection(meetUrl) : "",
    message
      ? `<p style="margin:18px 0 8px;font-size:13px;font-weight:700;color:#a1a1aa;">Wiadomość od klienta</p>
         <p style="margin:0 0 24px;padding:14px 16px;border-radius:12px;background:#1c1c1c;border:1px solid #2a2a2a;font-size:15px;line-height:1.55;color:#ffffff;white-space:pre-wrap;">${escapeHtml(message)}</p>`
      : `<p style="margin:0 0 24px;"></p>`,
  ].join("");

  const text = [
    "Nowa rezerwacja konsultacji",
    "",
    `Imię i nazwisko: ${booking.name}`,
    `E-mail: ${booking.email}`,
    `Telefon: ${phone}`,
    `Data: ${dateLabel}`,
    `Godzina: ${timeLabel}`,
    ...(meetUrl ? ["", `Link Meet: ${meetUrl}`] : []),
    "",
    "Wiadomość:",
    message || "—",
  ].join("\n");

  await sendEmail({
    to: [{ email: notifyEmail, name: "Z AI na Ty" }],
    subject: `Nowa rezerwacja konsultacji — ${booking.name} — ${dateLabel}, ${timeLabel}`,
    text,
    html: buildConsultationEmailHtml({
      title: "Nowa rezerwacja konsultacji",
      preheader: `${booking.name} — ${dateLabel}, godz. ${timeLabel}`,
      bodyHtml,
    }),
    replyTo: { email: booking.email, name: booking.name },
  });
}
