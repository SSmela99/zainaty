import { consultationTimeSlots } from "@/lib/consultations/calendar";

import type { ConsultationAvailability } from "./types";
import { toDateKey } from "./format";
import {
  isConsultationDayAvailable,
  isPastCalendarDay,
} from "@/lib/consultations/calendar";

export function isDayFullyExcluded(
  dateKey: string,
  exclusions: ConsultationAvailability["exclusions"],
): boolean {
  return exclusions.some(
    (exclusion) => exclusion.date === dateKey && exclusion.time == null,
  );
}

export function isTimeExcluded(
  dateKey: string,
  time: string,
  exclusions: ConsultationAvailability["exclusions"],
): boolean {
  if (isDayFullyExcluded(dateKey, exclusions)) {
    return true;
  }

  return exclusions.some(
    (exclusion) => exclusion.date === dateKey && exclusion.time === time,
  );
}

export function isTimeBooked(
  dateKey: string,
  time: string,
  bookedSlots: ConsultationAvailability["bookedSlots"],
): boolean {
  return bookedSlots.some(
    (slot) => slot.date === dateKey && slot.time === time,
  );
}

export function isTimeSlotAvailable(
  dateKey: string,
  time: string,
  availability: ConsultationAvailability,
): boolean {
  return (
    !isTimeExcluded(dateKey, time, availability.exclusions) &&
    !isTimeBooked(dateKey, time, availability.bookedSlots)
  );
}

export function isCalendarDayBookable(
  date: Date,
  availability: ConsultationAvailability,
): boolean {
  if (!isConsultationDayAvailable(date) || isPastCalendarDay(date)) {
    return false;
  }

  const dateKey = toDateKey(date);

  if (isDayFullyExcluded(dateKey, availability.exclusions)) {
    return false;
  }

  return consultationTimeSlots.some((time) =>
    isTimeSlotAvailable(dateKey, time, availability),
  );
}

export function getAvailableTimesForDate(
  date: Date,
  availability: ConsultationAvailability,
): string[] {
  const dateKey = toDateKey(date);

  return consultationTimeSlots.filter((time) =>
    isTimeSlotAvailable(dateKey, time, availability),
  );
}
