import type { Metadata } from "next";

import { getConsultationAvailability } from "@/app/actions/consultations";
import {
  ConsultationBooking,
  ConsultationPageFeatures,
  ConsultationPageHero,
} from "@/components/consultation-page";

export const metadata: Metadata = {
  title: "Konsultacja",
  description:
    "Bezpłatna 30-minutowa konsultacja online — wybierz termin i porozmawiajmy o Twoich potrzebach w AI.",
};

export default async function KonsultacjaPage() {
  const initialAvailability = await getConsultationAvailability();

  return (
    <>
      <ConsultationPageHero />
      <ConsultationPageFeatures />
      <ConsultationBooking initialAvailability={initialAvailability} />
    </>
  );
}
