import { toFooterSettings } from "./defaults";
import type { FooterSettings } from "./types";
import { createPublicClient } from "@/lib/supabase/public";

export async function getFooterSettings(): Promise<FooterSettings> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_footer_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  if (error) {
    console.error("getFooterSettings:", error.message);
    return toFooterSettings(null);
  }

  return toFooterSettings(data);
}
