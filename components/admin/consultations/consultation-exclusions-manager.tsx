"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";

import {
  createConsultationExclusion,
  deleteConsultationExclusion,
  listConsultationExclusions,
} from "@/app/admin/actions/consultations";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminLoading } from "@/components/admin/admin-loading";
import { AdminMessage, AdminPanelCard } from "@/components/admin/blog/blog-admin.shared";
import { ConsultationDateCalendar } from "@/components/consultations";
import { Button } from "@/components/ui/button";
import { consultationTimeSlots } from "@/lib/consultations/calendar";
import {
  formatBookingDate,
  formatBookingDateTime,
  parseDateKey,
  toDateKey,
} from "@/lib/consultations/format";
import type { ConsultationExclusion } from "@/lib/consultations/types";
import {
  consultationExclusionSchema,
  type ConsultationExclusionFormValues,
} from "@/lib/validation/admin-consultation-exclusion.schemas";
import { cn } from "@/lib/utils";

const emptyForm: ConsultationExclusionFormValues = {
  exclusionDate: "",
  wholeDay: false,
  times: [],
};

export function ConsultationExclusionsManager() {
  const [exclusions, setExclusions] = useState<ConsultationExclusion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [exclusionToDelete, setExclusionToDelete] =
    useState<ConsultationExclusion | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ConsultationExclusionFormValues>({
    resolver: yupResolver(consultationExclusionSchema),
    defaultValues: emptyForm,
  });

  const wholeDay = watch("wholeDay");
  const selectedTimes = watch("times");
  const exclusionDate = watch("exclusionDate");

  const excludedDateKeys = useMemo(
    () => new Set(exclusions.map((exclusion) => exclusion.exclusion_date)),
    [exclusions],
  );

  const loadExclusions = useCallback(async () => {
    setIsLoading(true);
    const result = await listConsultationExclusions();

    if (result.ok) {
      setExclusions(result.data);
      setError(null);
    } else {
      setError(result.error ?? "Nie udało się wczytać wykluczeń.");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadExclusions();
  }, [loadExclusions]);

  useEffect(() => {
    if (!exclusionDate) {
      setSelectedDate(null);
      return;
    }

    setSelectedDate(parseDateKey(exclusionDate));
  }, [exclusionDate]);

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
    setValue("exclusionDate", toDateKey(date), { shouldValidate: true });
  }

  function toggleTime(time: string) {
    const nextTimes = selectedTimes.includes(time)
      ? selectedTimes.filter((value) => value !== time)
      : [...selectedTimes, time];

    setValue("times", nextTimes, { shouldValidate: true });
  }

  function resetForm() {
    reset(emptyForm);
    setSelectedDate(null);
  }

  const onSubmit = handleSubmit((values) => {
    setError(null);

    startTransition(async () => {
      const result = await createConsultationExclusion(values);

      if (!result.ok) {
        setError(result.error ?? "Nie udało się dodać wykluczenia.");
        return;
      }

      toast.success("Wykluczenie dodane.");
      resetForm();
      await loadExclusions();
    });
  });

  function confirmDelete() {
    if (!exclusionToDelete) return;

    const id = exclusionToDelete.id;
    setError(null);

    startTransition(async () => {
      const result = await deleteConsultationExclusion(id);

      if (!result.ok) {
        setError(result.error ?? "Nie udało się usunąć wykluczenia.");
        return;
      }

      setExclusionToDelete(null);
      toast.success("Wykluczenie usunięte.");
      await loadExclusions();
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
          Dodaj wykluczenie
        </h2>
        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          <div className="space-y-2">
            <p className="text-sm font-bold text-zinc-950 dark:text-white">
              Wybierz dzień <span className="text-[#f24a00]">*</span>
            </p>
            <div className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
              <ConsultationDateCalendar
                selectedDate={selectedDate}
                onSelectDate={handleDateSelect}
                hasDateMarker={(date) =>
                  excludedDateKeys.has(toDateKey(date))
                }
              />
            </div>
            {selectedDate ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Wybrano:{" "}
                <span className="font-bold text-zinc-950 dark:text-white">
                  {formatBookingDate(toDateKey(selectedDate))}
                </span>
              </p>
            ) : null}
            {errors.exclusionDate ? (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.exclusionDate.message}
              </p>
            ) : null}
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <Controller
              name="wholeDay"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(event) => {
                    field.onChange(event.target.checked);
                    if (event.target.checked) {
                      setValue("times", [], { shouldValidate: true });
                    }
                  }}
                  className="size-4 accent-[#f24a00] dark:accent-[#daff02]"
                />
              )}
            />
            <span className="text-sm font-bold text-zinc-950 dark:text-white">
              Wyklucz cały dzień
            </span>
          </label>

          {!wholeDay ? (
            <div className="space-y-3">
              <p className="text-sm font-bold text-zinc-950 dark:text-white">
                Wybierz godziny do wykluczenia
              </p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {consultationTimeSlots.map((time) => {
                  const isSelected = selectedTimes.includes(time);

                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => toggleTime(time)}
                      className={cn(
                        "cursor-pointer rounded-xl px-2 py-2.5 text-sm font-bold transition-colors",
                        isSelected
                          ? "bg-[#f24a00] text-white dark:bg-[#daff02] dark:text-zinc-950"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700",
                      )}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
              {errors.times ? (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.times.message}
                </p>
              ) : null}
            </div>
          ) : null}

          <Button
            type="submit"
            disabled={isPending}
            className="h-10 bg-[#f24a00] px-5 text-white hover:bg-[#d94200] dark:bg-[#daff02] dark:text-black dark:hover:bg-[#9bec00]"
          >
            {isPending ? "Zapisywanie..." : "Dodaj wykluczenie"}
          </Button>
        </form>
      </AdminPanelCard>

      <AdminPanelCard>
        <h2 className="mb-5 text-lg font-black tracking-[0.02em] text-zinc-950 dark:text-white">
          Aktywne wykluczenia
        </h2>
        {exclusions.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Brak wykluczonych terminów.
          </p>
        ) : (
          <ul className="space-y-3">
            {exclusions.map((exclusion) => (
              <li
                key={exclusion.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-800"
              >
                <div>
                  <p className="font-bold text-zinc-950 dark:text-white">
                    {exclusion.excluded_time
                      ? formatBookingDateTime(
                          exclusion.exclusion_date,
                          exclusion.excluded_time,
                        )
                      : `${formatBookingDate(exclusion.exclusion_date)} — cały dzień`}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setExclusionToDelete(exclusion)}
                  className="shrink-0 text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  <Trash2Icon className="size-4" />
                  Usuń
                </Button>
              </li>
            ))}
          </ul>
        )}
      </AdminPanelCard>

      <AdminConfirmDialog
        open={exclusionToDelete != null}
        onOpenChange={(open) => {
          if (!open && !isPending) setExclusionToDelete(null);
        }}
        title="Usunąć wykluczenie?"
        description="Termin znów będzie dostępny do rezerwacji."
        confirmLabel="Usuń"
        isPending={isPending}
        onConfirm={confirmDelete}
      />
    </>
  );
}
