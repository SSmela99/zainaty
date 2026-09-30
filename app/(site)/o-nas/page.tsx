import type { Metadata } from "next";

import { AboutContent, AboutCta, AboutHero, AboutValues } from "@/components/about";
import { PATHS } from "@/lib/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "O nas",
  description:
    "Technologia jest dla ludzi - uczymy AI i nowych narzędzi w sposób jasny, praktyczny i bez presji.",
  path: PATHS.ABOUT,
});

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
