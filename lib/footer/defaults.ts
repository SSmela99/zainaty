import type { FooterSettings, FooterSettingsFormInput } from "./types";

export const DEFAULT_FOOTER_SETTINGS: FooterSettingsFormInput = {
  description:
    "Uczymy, jak korzystać z technologii i AI bez stresu. Dla każdego — niezależnie od wieku i doświadczenia.",
  social_facebook: "",
  social_instagram: "",
  social_linkedin: "",
  social_youtube: "",
  contact_line_1: "ul. Przykładowa 123",
  contact_line_2: "00-001 Warszawa",
  contact_line_3: "+48 123 456 789",
  contact_line_4: "kontakt@zainaty.pl",
};

export function toFooterSettings(
  row: Record<string, unknown> | null | undefined,
): FooterSettings {
  if (!row) {
    return {
      id: "default",
      updated_at: new Date(0).toISOString(),
      ...DEFAULT_FOOTER_SETTINGS,
    };
  }

  return {
    id: row.id as string,
    description: row.description as string,
    social_facebook: row.social_facebook as string,
    social_instagram: row.social_instagram as string,
    social_linkedin: row.social_linkedin as string,
    social_youtube: row.social_youtube as string,
    contact_line_1: row.contact_line_1 as string,
    contact_line_2: row.contact_line_2 as string,
    contact_line_3: row.contact_line_3 as string,
    contact_line_4: row.contact_line_4 as string,
    updated_at: row.updated_at as string,
  };
}
