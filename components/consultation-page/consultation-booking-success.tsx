import { CheckIcon } from "lucide-react";

import { formatBookingSuccessSlot } from "@/lib/consultations/format";

type ConsultationBookingSuccessProps = {
  scheduledDate: string;
  scheduledTime: string;
  email: string;
};

export function ConsultationBookingSuccess({
  scheduledDate,
  scheduledTime,
  email,
}: ConsultationBookingSuccessProps) {
  return (
    <div className="mx-auto max-w-2xl rounded-3xl bg-white px-8 py-14 text-center shadow-[0_4px_24px_rgba(0,0,0,0.05)] md:px-12 md:py-16 dark:bg-[#1c1c1c] dark:shadow-[0_8px_32px_rgba(0,0,0,0.28)]">
      <div className="relative mx-auto flex size-20 items-center justify-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[#ff4b12]/15 blur-md dark:bg-[#d7ff00]/20"
        />
        <span className="relative flex size-16 items-center justify-center rounded-full bg-[#ffe8dc] dark:bg-[#3a3d10]">
          <CheckIcon
            className="size-8 text-[#ff4b12] dark:text-[#d7ff00]"
            strokeWidth={2.5}
          />
        </span>
      </div>

      <h2 className="mt-8 text-3xl leading-tight font-black tracking-[-0.03em] text-zinc-950 md:text-4xl dark:text-white">
        Gotowe! Do zobaczenia
      </h2>

      <p className="mt-5 text-base leading-7 text-zinc-600 dark:text-zinc-400">
        Zapisaliśmy Twój termin:{" "}
        <span className="font-black text-[#ff4b12] dark:text-[#d7ff00]">
          {formatBookingSuccessSlot(scheduledDate, scheduledTime)}
        </span>
      </p>

      <p className="mt-4 text-sm leading-6 text-zinc-500 md:text-base dark:text-zinc-400">
        Wyślemy Ci potwierdzenie na adres{" "}
        <span className="font-bold text-zinc-950 dark:text-white">{email}</span>{" "}
        z linkiem do spotkania.
      </p>
    </div>
  );
}
