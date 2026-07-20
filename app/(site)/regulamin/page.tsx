import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal";
import { termsContent } from "@/components/legal/terms.utils";
import { PATHS } from "@/lib/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Regulamin",
  description:
    "Regulamin serwisu Z AI na Ty — zasady korzystania z serwisu, newslettera i produktów cyfrowych.",
  path: PATHS.TERMS,
});

export default function TermsPage() {
  return <LegalDocument {...termsContent} />;
}
