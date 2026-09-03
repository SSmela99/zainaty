"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { CalendarIcon, ClockIcon, MailIcon, PhoneIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import {
  deleteConsultationBooking,
  listConsultationBookings,
} from "@/app/admin/actions/consultations";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminLoading } from "@/components/admin/admin-loading";
import { AdminMessage, AdminPanelCard } from "@/components/admin/blog/blog-admin.shared";
import { Button } from "@/components/ui/button";
import { formatBookingDate, formatBookingDateTime } from "@/lib/consultations/format";
import type { ConsultationBooking } from "@/lib/consultations/types";

export function ConsultationBookingsList() {
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingToDelete, setBookingToDelete] = useState<ConsultationBooking | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    const result = await listConsultationBookings();

    if (result.ok) {
      setBookings(result.data);
      setError(null);
    } else {
      setError(result.error ?? "Nie udało się wczytać rezerwacji.");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  function confirmDelete() {
    if (!bookingToDelete) return;

    const id = bookingToDelete.id;
    setError(null);

    startTransition(async () => {
      const result = await deleteConsultationBooking(id);

      if (!result.ok) {
        setError(result.error ?? "Nie udało się usunąć rezerwacji.");
        return;
      }

      setBookingToDelete(null);
      toast.success("Rezerwacja usunięta.");
      await loadBookings();
    });
  }

  if (isLoading) {
    return <AdminLoading />;
  }

  return (
    <>
      {error ? <AdminMessage error={error} /> : null}

      <AdminPanelCard>
        <h2 className="mb-5 text-lg font-black tracking-[0.02em] text-zinc-950 dark:text-white">
          Zarezerwowane terminy
        </h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Brak rezerwacji.
          </p>
        ) : (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 space-y-3">
                    <div>
                      <p className="text-lg font-black text-zinc-950 dark:text-white">
                        {booking.name}
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <CalendarIcon className="size-4 shrink-0" />
                        {formatBookingDate(booking.scheduled_date)}
                        <span aria-hidden>·</span>
                        <ClockIcon className="size-4 shrink-0" />
                        {booking.scheduled_time}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="inline-flex items-center gap-2">
                        <MailIcon className="size-4 shrink-0" />
                        {booking.email}
                      </span>
                      {booking.phone ? (
                        <span className="inline-flex items-center gap-2">
                          <PhoneIcon className="size-4 shrink-0" />
                          {booking.phone}
                        </span>
                      ) : null}
                    </div>

                    {booking.meet_url ? (
                      <p className="text-sm">
                        <a
                          href={booking.meet_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-zinc-950 underline underline-offset-2 dark:text-white"
                        >
                          Link Google Meet
                        </a>
                      </p>
                    ) : null}

                    {booking.message ? (
                      <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                        {booking.message}
                      </p>
                    ) : null}

                    <p className="text-xs text-zinc-400">
                      Zgłoszono:{" "}
                      {new Intl.DateTimeFormat("pl-PL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(new Date(booking.created_at))}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setBookingToDelete(booking)}
                    className="shrink-0 text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <Trash2Icon className="size-4" />
                    Usuń
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminPanelCard>

      <AdminConfirmDialog
        open={bookingToDelete != null}
        onOpenChange={(open) => {
          if (!open && !isPending) setBookingToDelete(null);
        }}
        title="Usunąć rezerwację?"
        description={
          bookingToDelete
            ? `Rezerwacja: ${bookingToDelete.name}, ${formatBookingDateTime(bookingToDelete.scheduled_date, bookingToDelete.scheduled_time)}`
            : ""
        }
        confirmLabel="Usuń"
        isPending={isPending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
