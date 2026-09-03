"use server";

import { revalidatePath } from "next/cache";
import * as yup from "yup";

import {
  getAvailableTimesForDate,
  isCalendarDayBookable,
  isTimeSlotAvailable,
} from "@/lib/consultations/availability";
import { toDateKey } from "@/lib/consultations/format";
import type {
  ConsultationActionResult,
  ConsultationAvailability,
  ConsultationBooking,
  ConsultationBookingFormInput,
} from "@/lib/consultations/types";
import { sendConsultationBookingConfirmation } from "@/lib/brevo/send-consultation-confirmation";
import { sendConsultationBookingNotification } from "@/lib/brevo/send-consultation-notification";
import { createConsultationMeetEvent } from "@/lib/google/create-consultation-meet";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { consultationBookingSchema } from "@/lib/validation/consultation-booking.schemas";

function normalizeDateKey(value: string): string {
  return value.slice(0, 10);
}

function mapAvailability(data: unknown): ConsultationAvailability {
  const payload = data as {
    booked_slots?: { date: string; time: string }[];
    exclusions?: { date: string; time: string | null }[];
  };

  return {
    bookedSlots: (payload.booked_slots ?? []).map((slot) => ({
      date: normalizeDateKey(slot.date),
      time: slot.time,
    })),
    exclusions: (payload.exclusions ?? []).map((exclusion) => ({
      date: normalizeDateKey(exclusion.date),
      time: exclusion.time,
    })),
  };
}

function mapBooking(row: Record<string, unknown>): ConsultationBooking {
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone as string | null) ?? null,
    message: (row.message as string | null) ?? null,
    scheduled_date: normalizeDateKey(row.scheduled_date as string),
    scheduled_time: row.scheduled_time as string,
    meet_url: (row.meet_url as string | null) ?? null,
    google_calendar_event_id:
      (row.google_calendar_event_id as string | null) ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

export async function getConsultationAvailability(): Promise<ConsultationAvailability> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_consultation_availability");

  if (error || !data) {
    return { bookedSlots: [], exclusions: [] };
  }

  return mapAvailability(data);
}

export async function createConsultationBooking(
  input: ConsultationBookingFormInput,
): Promise<ConsultationActionResult<ConsultationBooking>> {
  try {
    const values = await consultationBookingSchema.validate(
      {
        name: input.name,
        email: input.email,
        phone: input.phone ?? "",
        message: input.message ?? "",
        scheduledDate: input.scheduledDate,
        scheduledTime: input.scheduledTime,
      },
      { abortEarly: false, stripUnknown: true },
    );

    const availability = await getConsultationAvailability();

    if (
      !isTimeSlotAvailable(
        values.scheduledDate,
        values.scheduledTime,
        availability,
      )
    ) {
      return {
        ok: false,
        error: "Wybrany termin nie jest już dostępny. Wybierz inny.",
      };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("create_consultation_booking", {
      p_name: values.name.trim(),
      p_email: values.email.trim(),
      p_phone: values.phone?.trim() || null,
      p_message: values.message?.trim() || null,
      p_scheduled_date: values.scheduledDate,
      p_scheduled_time: values.scheduledTime,
    });

    if (error) {
      if (
        error.message.includes("slot_taken") ||
        error.code === "23505"
      ) {
        return {
          ok: false,
          error: "Ten termin został właśnie zarezerwowany. Wybierz inny.",
        };
      }

      return { ok: false, error: error.message };
    }

    const row = Array.isArray(data) ? data[0] : data;

    if (!row) {
      return { ok: false, error: "Nie udało się zarezerwować terminu." };
    }

    revalidatePath("/konsultacja");
    revalidatePath("/admin");

    let booking = mapBooking(row as Record<string, unknown>);

    try {
      const meet = await createConsultationMeetEvent({
        bookingId: booking.id,
        name: booking.name,
        email: booking.email,
        scheduledDate: booking.scheduled_date,
        scheduledTime: booking.scheduled_time,
        message: booking.message,
      });

      const admin = createAdminClient();
      const { data: updated, error: updateError } = await admin
        .from("consultation_bookings")
        .update({
          meet_url: meet.meetUrl,
          google_calendar_event_id: meet.eventId,
        })
        .eq("id", booking.id)
        .select("*")
        .single();

      if (updateError) {
        console.error(
          "[consultations] Zapis meet_url nieudany:",
          updateError.message,
        );
        booking = { ...booking, meet_url: meet.meetUrl, google_calendar_event_id: meet.eventId };
      } else if (updated) {
        booking = mapBooking(updated as Record<string, unknown>);
      }
    } catch (error) {
      console.error("[consultations] Tworzenie Google Meet:", error);
    }

    try {
      await sendConsultationBookingNotification(booking);
    } catch (error) {
      console.error("[consultations] Powiadomienie e-mail:", error);
    }

    try {
      await sendConsultationBookingConfirmation(booking);
    } catch (error) {
      console.error("[consultations] Potwierdzenie e-mail dla klienta:", error);
    }

    return { ok: true, data: booking };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { ok: false, error: error.errors[0] ?? error.message };
    }

    return { ok: false, error: "Nie udało się zarezerwować terminu." };
  }
}

export async function validateConsultationSlot(
  scheduledDate: string,
  scheduledTime: string,
): Promise<boolean> {
  const availability = await getConsultationAvailability();

  return isTimeSlotAvailable(scheduledDate, scheduledTime, availability);
}

export async function getBookableTimesForDate(
  date: Date,
): Promise<string[]> {
  const availability = await getConsultationAvailability();

  if (!isCalendarDayBookable(date, availability)) {
    return [];
  }

  return getAvailableTimesForDate(date, availability);
}

export { toDateKey };
