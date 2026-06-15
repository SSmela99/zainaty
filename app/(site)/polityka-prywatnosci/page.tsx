import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal";
import { privacyPolicyContent } from "@/components/legal/privacy-policy.utils";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności serwisu Z AI na Ty — informacje o przetwarzaniu danych osobowych, cookies i Twoich prawach.",
};

export default function PrivacyPolicyPage() {
  return <LegalDocument {...privacyPolicyContent} />;
}
