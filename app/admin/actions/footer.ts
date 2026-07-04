"use server";

import { revalidatePath } from "next/cache";

import { toFooterSettings } from "@/lib/footer/defaults";
import type {
  FooterActionResult,
  FooterSettings,
  FooterSettingsFormInput,
} from "@/lib/footer/types";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function getFooterSettingsAdmin(): Promise<
  FooterActionResult<FooterSettings>
> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("site_footer_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: toFooterSettings(data) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function updateFooterSettings(
  input: FooterSettingsFormInput,
): Promise<FooterActionResult<FooterSettings>> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("site_footer_settings")
      .upsert({ id: "default", ...input }, { onConflict: "id" })
      .select("*")
      .single();

    if (error) return { ok: false, error: error.message };

    revalidatePath("/admin");
    revalidatePath("/", "layout");

    return { ok: true, data: toFooterSettings(data) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}
