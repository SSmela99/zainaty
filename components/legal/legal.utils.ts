export type LegalTable = {
  headers: readonly string[];
  rows: readonly (readonly string[])[];
};

export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: readonly string[] }
  | { type: "table"; table: LegalTable };

export type LegalDownload = {
  label: string;
  href: string;
  description?: string;
};

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: readonly string[];
  list?: readonly string[];
  blocks?: readonly LegalBlock[];
};

export const LEGAL_CONTACT_EMAIL = "kontakt@zainaty.com.pl";
export const LEGAL_CONTACT_PHONE = "511 770 170";
export const LEGAL_SELLER_ADDRESS = "ul. Maratońska 87 lok. 3, 94-007 Łódź";

/** Region hostingu bazy Supabase — uzupełnij dokładny region z panelu projektu. */
export const SUPABASE_PROCESSING_REGION =
  "Unia Europejska (region projektu Supabase)";

/** Wspólna data obowiązywania dokumentów v2.1. */
export const LEGAL_LAST_UPDATED = "27 września 2026 r.";
export const TERMS_VERSION = "2.1";
export const PRIVACY_VERSION = "2.1";
