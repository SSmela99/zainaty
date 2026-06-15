import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal";
import { termsContent } from "@/components/legal/terms.utils";

export const metadata: Metadata = {
  title: "Regulamin",
  description:
    "Regulamin serwisu Z AI na Ty — zasady korzystania z serwisu, newslettera i produktów cyfrowych.",
};

export default function TermsPage() {
  return <LegalDocument {...termsContent} />;
}
