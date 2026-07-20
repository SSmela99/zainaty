import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal";
import { privacyPolicyContent } from "@/components/legal/privacy-policy.utils";
import { PATHS } from "@/lib/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Polityka prywatności",
  description:
    "Polityka prywatności serwisu Z AI na Ty — informacje o przetwarzaniu danych osobowych, cookies i Twoich prawach.",
  path: PATHS.PRIVACY,
});

export default function PrivacyPolicyPage() {
  return <LegalDocument {...privacyPolicyContent} />;
}
