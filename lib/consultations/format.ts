export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function formatBookingDate(dateKey: string): string {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parseDateKey(dateKey));
}

export function formatBookingDateTime(dateKey: string, time: string): string {
  return `${dateKey} o godz. ${time}`;
}

export function formatBookingSuccessSlot(dateKey: string, time: string): string {
  return `${dateKey}, godz. ${time}`;
}
