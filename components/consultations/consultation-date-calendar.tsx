"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

import {
  consultationMonthNames,
  consultationWeekdays,
  getCalendarMonthDays,
  isSameCalendarDay,
} from "@/lib/consultations";
import { cn } from "@/lib/utils";

type ConsultationDateCalendarProps = {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  isDateDisabled?: (date: Date) => boolean;
  hasDateMarker?: (date: Date) => boolean;
  className?: string;
};

export function ConsultationDateCalendar({
  selectedDate,
  onSelectDate,
  isDateDisabled,
  hasDateMarker,
  className,
}: ConsultationDateCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const initial = selectedDate ?? new Date();
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });

  const monthDays = getCalendarMonthDays(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth(),
  );

  function goToPreviousMonth() {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
    );
  }

  function goToNextMonth() {
    setVisibleMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-white"
          aria-label="Poprzedni miesiąc"
        >
          <ChevronLeftIcon className="size-5" />
        </button>

        <p className="text-base font-black text-zinc-950 dark:text-white">
          {consultationMonthNames[visibleMonth.getMonth()]}{" "}
          {visibleMonth.getFullYear()}
        </p>

        <button
          type="button"
          onClick={goToNextMonth}
          className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-white"
          aria-label="Następny miesiąc"
        >
          <ChevronRightIcon className="size-5" />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1 text-center">
        {consultationWeekdays.map((weekday) => (
          <div
            key={weekday}
            className="py-2 text-xs font-bold text-zinc-400 dark:text-zinc-500"
          >
            {weekday}
          </div>
        ))}

        {monthDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} aria-hidden />;
          }

          const disabled = isDateDisabled?.(date) ?? false;
          const isSelected =
            selectedDate != null && isSameCalendarDay(date, selectedDate);
          const showMarker = hasDateMarker?.(date) ?? false;

          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => onSelectDate(date)}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center rounded-xl py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-35",
                isSelected
                  ? "bg-[#f24a00] text-white dark:bg-[#daff02] dark:text-zinc-950"
                  : disabled
                    ? "text-zinc-400 dark:text-zinc-600"
                    : "text-zinc-950 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-800",
              )}
            >
              <span>{date.getDate()}</span>
              {showMarker && !isSelected ? (
                <span
                  aria-hidden
                  className="mt-1 size-1.5 rounded-full bg-[#f24a00] dark:bg-[#daff02]"
                />
              ) : (
                <span aria-hidden className="mt-1 size-1.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
