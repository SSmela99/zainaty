"use server";

import { revalidatePath } from "next/cache";
import * as yup from "yup";

import { requireAdmin } from "@/lib/auth/require-admin";
import type {
  ConsultationActionResult,
  ConsultationBooking,
  ConsultationExclusion,
  ConsultationExclusionFormInput,
} from "@/lib/consultations/types";
import { consultationExclusionSchema } from "@/lib/validation/admin-consultation-exclusion.schemas";

function normalizeDateKey(value: string): string {
  return value.slice(0, 10);
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
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function mapExclusion(row: Record<string, unknown>): ConsultationExclusion {
  return {
    id: row.id as string,
    exclusion_date: normalizeDateKey(row.exclusion_date as string),
    excluded_time: (row.excluded_time as string | null) ?? null,
    created_at: row.created_at as string,
  };
}

function revalidateConsultationPaths() {
  revalidatePath("/admin");
  revalidatePath("/konsultacja");
}

export async function listConsultationBookings(): Promise<
  ConsultationActionResult<ConsultationBooking[]>
> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("consultation_bookings")
      .select("*")
      .order("scheduled_date", { ascending: false })
      .order("scheduled_time", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) return { ok: false, error: error.message };

    return { ok: true, data: (data ?? []).map(mapBooking) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function deleteConsultationBooking(
  id: string,
): Promise<ConsultationActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase
      .from("consultation_bookings")
      .delete()
      .eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidateConsultationPaths();
    return { ok: true };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function listConsultationExclusions(): Promise<
  ConsultationActionResult<ConsultationExclusion[]>
> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("consultation_exclusions")
      .select("*")
      .order("exclusion_date", { ascending: false })
      .order("excluded_time", { ascending: true, nullsFirst: true });

    if (error) return { ok: false, error: error.message };

    return { ok: true, data: (data ?? []).map(mapExclusion) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function createConsultationExclusion(
  input: ConsultationExclusionFormInput,
): Promise<ConsultationActionResult<ConsultationExclusion[]>> {
  try {
    const supabase = await requireAdmin();
    const values = await consultationExclusionSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    const rows: Array<{
      exclusion_date: string;
      excluded_time: string | null;
    }> = values.wholeDay
      ? [{ exclusion_date: values.exclusionDate, excluded_time: null }]
      : values.times.map((time) => ({
          exclusion_date: values.exclusionDate,
          excluded_time: time,
        }));

    const { data, error } = await supabase
      .from("consultation_exclusions")
      .insert(rows)
      .select("*");

    if (error) {
      if (error.code === "23505") {
        return {
          ok: false,
          error: "Wybrany termin jest już wykluczony.",
        };
      }

      return { ok: false, error: error.message };
    }

    revalidateConsultationPaths();
    return { ok: true, data: (data ?? []).map(mapExclusion) };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { ok: false, error: error.errors[0] ?? error.message };
    }

    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function deleteConsultationExclusion(
  id: string,
): Promise<ConsultationActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase
      .from("consultation_exclusions")
      .delete()
      .eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidateConsultationPaths();
    return { ok: true };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}
