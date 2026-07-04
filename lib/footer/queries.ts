import { createPublicClient } from "@/lib/supabase/public";

import { toFooterSettings } from "./defaults";
import type { FooterSettings } from "./types";

export async function getFooterSettings(): Promise<FooterSettings> {
  try {
    const supabase = createPublicClient();

    if (!supabase) {
      return toFooterSettings(null);
    }

    const { data, error } = await supabase
      .from("site_footer_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("getFooterSettings:", error.message);
      }

      return toFooterSettings(null);
    }

    return toFooterSettings(data);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      const message =
        error instanceof Error ? error.message : "Nieznany błąd pobierania stopki.";
      console.error("getFooterSettings:", message);
    }

    return toFooterSettings(null);
  }
}
