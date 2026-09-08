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
import { sendEmail } from "./send-email";

const CONSULTATION_HOST = "Karol Stępień";

function getFirstName(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0];
  return first || fullName.trim() || "Cześć";
}

export async function sendConsultationBookingConfirmation(
  booking: ConsultationBooking,
): Promise<void> {
  const dateLabel = formatBookingDate(booking.scheduled_date);
  const timeLabel = booking.scheduled_time;
  const firstName = getFirstName(booking.name);
  const meetUrl = getConsultationMeetUrl(booking);

  if (!meetUrl) {
    console.warn(
      "[brevo] Brak meet_url i CONSULTATION_MEET_URL - mail bez linku Meet.",
    );
  }

  const bodyHtml = [
    consultationParagraph(`Cześć ${firstName}!`),
    consultationParagraph(
      "Dziękujemy za umówienie spotkania. Twoja rezerwacja została pomyślnie przyjęta. Poniżej znajdziesz wszystkie szczegóły dotyczące naszego nadchodzącego spotkania:",
    ),
    consultationDetailLine("Data", escapeHtml(dateLabel)),
    consultationDetailLine("Godzina", escapeHtml(timeLabel)),
    consultationDetailLine("Prowadzący", escapeHtml(CONSULTATION_HOST)),
    meetUrl ? consultationMeetSection(meetUrl) : "",
    `<p style="margin:18px 0 24px;font-size:15px;line-height:1.55;color:#ffffff;">
      Jeśli musisz zmienić termin lub odwołać spotkanie, skontaktuj się z nami. Do zobaczenia!
    </p>`,
  ].join("");

  const text = [
    "Potwierdzenie spotkania!",
    "",
    `Cześć ${firstName}!`,
    "",
    "Dziękujemy za umówienie spotkania. Twoja rezerwacja została pomyślnie przyjęta.",
    "",
    `Data: ${dateLabel}`,
    `Godzina: ${timeLabel}`,
    `Prowadzący: ${CONSULTATION_HOST}`,
    "",
    ...(meetUrl
      ? [
          "Jak dołączyć do spotkania?",
          "W godzinie spotkania kliknij poniższy link, aby dołączyć do rozmowy:",
          meetUrl,
          "",
        ]
      : []),
    "Jeśli musisz zmienić termin lub odwołać spotkanie, skontaktuj się z nami. Do zobaczenia!",
  ].join("\n");

  await sendEmail({
    to: [{ email: booking.email, name: booking.name }],
    subject: `Potwierdzenie konsultacji - ${dateLabel}, ${timeLabel}`,
    text,
    html: buildConsultationEmailHtml({
      title: "Potwierdzenie spotkania!",
      preheader: `Potwierdzenie konsultacji - ${dateLabel}, godz. ${timeLabel}`,
      bodyHtml,
    }),
  });
}
