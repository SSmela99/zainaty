import {
  getAvailableTimesForDate,
  isCalendarDayBookable,
  isTimeSlotAvailable,
} from "./availability";
import {
  consultationMonthNames,
  consultationTimeSlots,
  consultationWeekdays,
  getCalendarMonthDays,
  isConsultationDayAvailable,
  isPastCalendarDay,
  isPastTimeSlot,
  isSameCalendarDay,
} from "./calendar";
import { formatBookingDateTime, toDateKey } from "./format";

export {
  consultationMonthNames,
  consultationTimeSlots,
  consultationWeekdays,
  formatBookingDateTime,
  getAvailableTimesForDate,
  getCalendarMonthDays,
  isCalendarDayBookable,
  isConsultationDayAvailable,
  isPastCalendarDay,
  isPastTimeSlot,
  isSameCalendarDay,
  isTimeSlotAvailable,
  toDateKey,
};

export function formatSelectedSlot(date: Date, time: string): string {
  return formatBookingDateTime(toDateKey(date), time);
}
