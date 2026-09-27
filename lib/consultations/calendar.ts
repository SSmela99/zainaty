function buildConsultationTimeSlots(): readonly string[] {
  const slots: string[] = [];

  for (let hour = 10; hour <= 15; hour += 1) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);

    if (hour < 15) {
      slots.push(`${String(hour).padStart(2, "0")}:30`);
    }
  }

  return slots;
}

export const consultationTimeSlots = buildConsultationTimeSlots();

export const consultationWeekdays = [
  "Pn",
  "Wt",
  "Śr",
  "Cz",
  "Pt",
  "Sb",
  "Nd",
] as const;

export const consultationMonthNames = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
] as const;

export function isConsultationDayAvailable(date: Date): boolean {
  const day = date.getDay();

  return day !== 0 && day !== 6;
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isPastCalendarDay(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  return compareDate < today;
}

const CONSULTATION_TIME_ZONE = "Europe/Warsaw";

function getWarsawDateTimeParts(now: Date): { dateKey: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CONSULTATION_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return {
    dateKey: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

/** Slot jest niedostępny, gdy bieżący czas (PL) jest już równy lub późniejszy. */
export function isPastTimeSlot(
  dateKey: string,
  time: string,
  now: Date = new Date(),
): boolean {
  const nowParts = getWarsawDateTimeParts(now);

  if (dateKey < nowParts.dateKey) {
    return true;
  }

  if (dateKey > nowParts.dateKey) {
    return false;
  }

  const [hour, minute] = time.split(":").map(Number);
  const slotMinutes = hour * 60 + minute;

  return nowParts.minutes >= slotMinutes;
}

export function getCalendarMonthDays(
  year: number,
  month: number,
): (Date | null)[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const leadingEmpty = firstWeekday === 0 ? 6 : firstWeekday - 1;

  const cells: (Date | null)[] = Array.from(
    { length: leadingEmpty },
    () => null,
  );

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}
