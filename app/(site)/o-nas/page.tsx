import type { Metadata } from "next";

import { AboutContent, AboutCta, AboutHero, AboutValues } from "@/components/about";

export const metadata: Metadata = {
  title: "O nas",
  description:
    "Technologia jest dla ludzi — uczymy AI i nowych narzędzi w sposób jasny, praktyczny i bez presji.",
};

export default function ONasPage() {
  return (
    <>
      <AboutHero />
      <AboutContent />
      <AboutValues />
      <AboutCta />
    </>
  );
}
