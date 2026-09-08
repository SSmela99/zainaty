"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  UserIcon,
} from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { createConsultationBooking } from "@/app/actions/consultations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import {
  getAvailableTimesForDate,
  isCalendarDayBookable,
  isSameCalendarDay,
  isTimeSlotAvailable,
  toDateKey,
} from "@/lib/consultations";
import type { ConsultationAvailability } from "@/lib/consultations/types";
import {
  consultationBookingSchema,
  type ConsultationBookingFormValues,
} from "@/lib/validation/consultation-booking.schemas";
import { cn } from "@/lib/utils";

import { ConsultationBookingSuccess } from "./consultation-booking-success";
import {
  consultationMonthNames,
  consultationTimeSlots,
  consultationWeekdays,
  formatSelectedSlot,
  getCalendarMonthDays,
} from "./consultation-page.utils";

const fieldClassName =
  "h-12 rounded-xl border-0 bg-[#f1eee5] px-4 text-sm text-zinc-950 shadow-none focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-[#f24a00]/35 dark:bg-[#242424] dark:text-white dark:focus-visible:ring-[#daff02]/35";

const phoneInputClassName =
  "[&_button]:bg-[#f1eee5] [&_button]:shadow-none [&_button]:hover:bg-[#f1eee5] [&_button]:focus-visible:ring-2 [&_button]:focus-visible:ring-[#f24a00]/35 dark:[&_button]:bg-[#242424] dark:[&_button]:hover:bg-[#242424] dark:[&_button]:focus-visible:ring-[#daff02]/35 [&_input]:bg-[#f1eee5] [&_input]:shadow-none [&_input]:focus-visible:ring-2 [&_input]:focus-visible:ring-[#f24a00]/35 dark:[&_input]:bg-[#242424] dark:[&_input]:focus-visible:ring-[#daff02]/35";

const labelClassName = "text-sm font-bold text-zinc-950 dark:text-white";

const emptyForm: ConsultationBookingFormValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
  scheduledDate: "",
  scheduledTime: "",
};

type SuccessState = {
  scheduledDate: string;
  scheduledTime: string;
};

type ConsultationBookingProps = {
  initialAvailability: ConsultationAvailability;
};

export function ConsultationBooking({
  initialAvailability,
}: ConsultationBookingProps) {
  const [availability, setAvailability] =
    useState<ConsultationAvailability>(initialAvailability);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ConsultationBookingFormValues>({
    resolver: yupResolver(consultationBookingSchema),
    defaultValues: emptyForm,
  });

  const selectedTime = watch("scheduledTime");
  const message = watch("message");
  const hasSelectedSlot = Boolean(selectedDate && selectedTime);

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

  function handleDaySelect(date: Date) {
    if (!isCalendarDayBookable(date, availability)) {
      return;
    }

    setSelectedDate(date);
    setValue("scheduledDate", toDateKey(date), { shouldValidate: true });
    setValue("scheduledTime", "", { shouldValidate: true });
  }

  function handleTimeSelect(time: string) {
    if (!selectedDate) return;

    const dateKey = toDateKey(selectedDate);

    if (!isTimeSlotAvailable(dateKey, time, availability)) {
      return;
    }

    setValue("scheduledTime", time, { shouldValidate: true });
  }

  const availableTimes = selectedDate
    ? getAvailableTimesForDate(selectedDate, availability)
    : [];

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await createConsultationBooking({
        name: values.name,
        email: values.email,
        phone: values.phone || null,
        message: values.message || null,
        scheduledDate: values.scheduledDate,
        scheduledTime: values.scheduledTime,
      });

      if (!result.ok) {
        toast.error(result.error ?? "Nie udało się zarezerwować terminu.");
        return;
      }

      setAvailability((current) => ({
        ...current,
        bookedSlots: [
          ...current.bookedSlots,
          {
            date: values.scheduledDate,
            time: values.scheduledTime,
          },
        ],
      }));

      setSuccess({
        scheduledDate: values.scheduledDate,
        scheduledTime: values.scheduledTime,
      });
      setSelectedDate(null);
      reset(emptyForm);
    });
  });

  if (success) {
    return (
      <section className="pb-20 md:pb-28">
        <div className="site-container">
          <ConsultationBookingSuccess
            scheduledDate={success.scheduledDate}
            scheduledTime={success.scheduledTime}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="pb-20 md:pb-28">
      <div className="site-container grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] md:p-8 dark:bg-[#1c1c1c] dark:shadow-[0_8px_32px_rgba(0,0,0,0.28)]">
          <div className="flex items-center gap-2.5">
            <CalendarIcon
              className="size-5 text-[#f24a00] dark:text-[#daff02]"
              strokeWidth={2.2}
            />
            <h2 className="text-lg font-black tracking-[0.02em] text-zinc-950 dark:text-white">
              Wybierz dzień
            </h2>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-[#f1eee5] hover:text-zinc-950 dark:hover:bg-[#242424] dark:hover:text-white"
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
                className="inline-flex size-9 cursor-pointer items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-[#f1eee5] hover:text-zinc-950 dark:hover:bg-[#242424] dark:hover:text-white"
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

                const isAvailable = isCalendarDayBookable(date, availability);
                const isSelected =
                  selectedDate != null && isSameCalendarDay(date, selectedDate);

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => handleDaySelect(date)}
                    className={cn(
                      "flex cursor-pointer flex-col items-center justify-center rounded-xl py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-35",
                      isSelected
                        ? "bg-[#f24a00] text-white dark:bg-[#daff02] dark:text-zinc-950"
                        : isAvailable
                          ? "text-zinc-950 hover:bg-[#f1eee5] dark:text-white dark:hover:bg-[#242424]"
                          : "text-zinc-400 dark:text-zinc-600",
                    )}
                  >
                    <span>{date.getDate()}</span>
                    {isAvailable && !isSelected ? (
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

            <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span
                aria-hidden
                className="size-1.5 rounded-full bg-[#f24a00] dark:bg-[#daff02]"
              />
              Dostępne terminy
            </div>
            {errors.scheduledDate ? (
              <p className="mt-2 text-sm text-[#f24a00] dark:text-[#daff02]">
                {errors.scheduledDate.message}
              </p>
            ) : null}
          </div>

          <div className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <ClockIcon
                className="size-5 text-[#f24a00] dark:text-[#daff02]"
                strokeWidth={2.2}
              />
              <h2 className="text-lg font-black tracking-[0.02em] text-zinc-950 dark:text-white">
                Wybierz godzinę
              </h2>
            </div>

            {selectedDate ? (
              <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {consultationTimeSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  const isAvailable = availableTimes.includes(time);

                  return (
                    <button
                      key={time}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => handleTimeSelect(time)}
                      className={cn(
                        "cursor-pointer rounded-xl px-2 py-2.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-35",
                        isSelected
                          ? "bg-[#f24a00] text-white dark:bg-[#daff02] dark:text-zinc-950"
                          : isAvailable
                            ? "bg-[#ffdccf] text-[#f24a00] hover:bg-[#ffd0bc] dark:bg-[#3a2a20] dark:text-[#daff02] dark:hover:bg-[#4a3528]"
                            : "bg-zinc-100 text-zinc-400 dark:bg-[#242424] dark:text-zinc-600",
                      )}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-5 text-sm text-zinc-500 dark:text-zinc-400">
                Najpierw wybierz dzień w kalendarzu.
              </p>
            )}
            {errors.scheduledTime ? (
              <p className="mt-2 text-sm text-[#f24a00] dark:text-[#daff02]">
                {errors.scheduledTime.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] md:p-8 dark:bg-[#1c1c1c] dark:shadow-[0_8px_32px_rgba(0,0,0,0.28)]">
          <div className="flex items-center gap-2.5">
            <UserIcon
              className="size-5 text-[#f24a00] dark:text-[#daff02]"
              strokeWidth={2.2}
            />
            <h2 className="text-lg font-black tracking-[0.02em] text-zinc-950 dark:text-white">
              Twoje dane
            </h2>
          </div>

          {hasSelectedSlot && selectedDate && selectedTime ? (
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#ffdccf] px-4 py-3.5 dark:bg-[#3a2a20]">
              <CalendarIcon
                className="mt-0.5 size-4 shrink-0 text-[#f24a00] dark:text-[#daff02]"
                strokeWidth={2.2}
              />
              <div>
                <p className="text-xs font-bold tracking-wide text-[#f24a00] uppercase dark:text-[#daff02]">
                  Wybrany termin
                </p>
                <p className="mt-1 text-sm font-bold text-zinc-950 dark:text-white">
                  {formatSelectedSlot(selectedDate, selectedTime)}
                </p>
              </div>
            </div>
          ) : null}

          <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="consultation-name" className={labelClassName}>
                Imię i nazwisko <span className="text-[#f24a00]">*</span>
              </Label>
              <Input
                id="consultation-name"
                placeholder="Jan Kowalski"
                className={cn(
                  fieldClassName,
                  errors.name && "ring-2 ring-[#f24a00]/40",
                )}
                autoComplete="name"
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-sm text-[#f24a00] dark:text-[#daff02]">
                  {errors.name.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultation-email" className={labelClassName}>
                Adres e-mail <span className="text-[#f24a00]">*</span>
              </Label>
              <Input
                id="consultation-email"
                type="email"
                placeholder="jan@przyklad.pl"
                className={cn(
                  fieldClassName,
                  errors.email && "ring-2 ring-[#f24a00]/40",
                )}
                autoComplete="email"
                {...register("email")}
              />
              {errors.email ? (
                <p className="text-sm text-[#f24a00] dark:text-[#daff02]">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultation-phone" className={labelClassName}>
                Numer telefonu
              </Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    id="consultation-phone"
                    value={field.value}
                    onChange={field.onChange}
                    defaultCountry="PL"
                    international
                    countryCallingCodeEditable={false}
                    autoComplete="tel"
                    placeholder="Numer telefonu"
                    className={cn(
                      phoneInputClassName,
                      errors.phone && "[&_input]:ring-2 [&_input]:ring-[#f24a00]/40",
                    )}
                  />
                )}
              />
              {errors.phone ? (
                <p className="text-sm text-[#f24a00] dark:text-[#daff02]">
                  {errors.phone.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultation-message" className={labelClassName}>
                O czym chcesz porozmawiać?
              </Label>
              <div className="relative">
                <Textarea
                  id="consultation-message"
                  placeholder="Krótko opisz swoją sytuację lub pytanie..."
                  className={cn(
                    fieldClassName,
                    "min-h-32 resize-none py-3",
                    errors.message && "ring-2 ring-[#f24a00]/40",
                  )}
                  {...register("message")}
                />
                <span className="pointer-events-none absolute right-3 bottom-3 text-xs text-zinc-400 dark:text-zinc-500">
                  {message.length}/500
                </span>
              </div>
              {errors.message ? (
                <p className="text-sm text-[#f24a00] dark:text-[#daff02]">
                  {errors.message.message}
                </p>
              ) : null}
            </div>

            {hasSelectedSlot ? (
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-[#f24a00] text-sm font-black text-white transition-colors hover:bg-[#d94200] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-[#daff02] dark:text-zinc-950 dark:hover:bg-[#9bec00]"
              >
                <CalendarIcon className="size-4" strokeWidth={2.2} />
                {isPending ? "Rezerwowanie..." : "Zarezerwuj termin"}
              </button>
            ) : (
              <p className="pt-1 text-center text-sm text-zinc-400 dark:text-zinc-500">
                - Wybierz najpierw dzień i godzinę
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
