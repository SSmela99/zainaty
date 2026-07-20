import type { Metadata } from "next";

import { getConsultationAvailability } from "@/app/actions/consultations";
import {
  ConsultationBooking,
  ConsultationPageFeatures,
  ConsultationPageHero,
} from "@/components/consultation-page";
import { JsonLd } from "@/components/seo/json-ld";
import { PATHS } from "@/lib/paths";
import { serviceConsultationJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Konsultacja",
  description:
    "Bezpłatna 30-minutowa konsultacja online — wybierz termin i porozmawiajmy o Twoich potrzebach w AI.",
  path: PATHS.CONSULTATION,
});

export default async function KonsultacjaPage() {
  const initialAvailability = await getConsultationAvailability();

  return (
    <>
      <JsonLd data={serviceConsultationJsonLd()} />
      <ConsultationPageHero />
      <ConsultationPageFeatures />
      <ConsultationBooking initialAvailability={initialAvailability} />
    </>
  );
}
