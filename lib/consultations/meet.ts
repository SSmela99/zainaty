import type { ConsultationBooking } from "./types";

/** Preferuje unikalny Meet z rezerwacji; fallback: stały CONSULTATION_MEET_URL. */
export function getConsultationMeetUrl(
  booking?: Pick<ConsultationBooking, "meet_url"> | null,
): string | null {
  const fromBooking = booking?.meet_url?.trim();
  if (fromBooking) {
    return fromBooking;
  }

  const fallback = process.env.CONSULTATION_MEET_URL?.trim();
  return fallback || null;
}
