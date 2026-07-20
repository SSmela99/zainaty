import type { Metadata } from "next";

import {
  FreeMaterialsHero,
  FreeMaterialsListing,
} from "@/components/free-materials";
import {
  getPublishedFreeMaterials,
  getPublishedFreeMaterialTags,
} from "@/lib/free-materials/queries";
import { PATHS } from "@/lib/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Darmowe materiały",
  description:
    "E-booki, checklisty, szablony i kolorowanki — wszystko gotowe do pobrania. Bez rejestracji, bez zobowiązań.",
  path: PATHS.FREE_MATERIALS,
});

type FreeMaterialsPageProps = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function FreeMaterialsPage({
  searchParams,
}: FreeMaterialsPageProps) {
  const { tag } = await searchParams;
  const activeTagSlug = tag?.trim() || null;

  const [materials, tags] = await Promise.all([
    getPublishedFreeMaterials(activeTagSlug),
    getPublishedFreeMaterialTags(),
  ]);

  return (
    <div className="mx-auto max-w-350 px-8 pb-20 md:pb-28">
      <FreeMaterialsHero />
      <FreeMaterialsListing
        materials={materials}
        tags={tags}
        activeTagSlug={activeTagSlug}
      />
    </div>
  );
}
