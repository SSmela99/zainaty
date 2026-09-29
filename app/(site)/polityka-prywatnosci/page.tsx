import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal";
import { privacyPolicyContent } from "@/components/legal/privacy-policy.utils";
import { PATHS } from "@/lib/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-static";

export const metadata: Metadata = buildPageMetadata({
  title: "Polityka prywatności i cookies",
  description:
    "Polityka prywatności i cookies serwisu Z AI na Ty - informacje o przetwarzaniu danych osobowych, plikach cookies i Twoich prawach.",
  path: PATHS.PRIVACY,
});

export default function PrivacyPolicyPage() {
  return <LegalDocument {...privacyPolicyContent} />;
}
