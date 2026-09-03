import type { Metadata } from "next";

import {
  FreeMaterialsHero,
  FreeMaterialsListing,
} from "@/components/free-materials";
import {
  getPublishedFreeMaterialLinks,
  getPublishedFreeMaterials,
  getPublishedFreeMaterialTags,
} from "@/lib/free-materials/queries";
import { isFreeMaterialsLinksView } from "@/lib/free-materials/types";
import { PATHS } from "@/lib/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Darmowe materiały",
  description:
    "E-booki, checklisty, szablony i kolorowanki, wszystko do pobrania za darmo.",
  path: PATHS.FREE_MATERIALS,
});

type FreeMaterialsPageProps = {
  searchParams: Promise<{ tag?: string; view?: string }>;
};

export default async function FreeMaterialsPage({
  searchParams,
}: FreeMaterialsPageProps) {
  const { tag, view } = await searchParams;
  const linksViewActive = isFreeMaterialsLinksView(view);
  const activeTagSlug = linksViewActive ? null : tag?.trim() || null;

  const [materials, tags, links] = await Promise.all([
    linksViewActive
      ? Promise.resolve([])
      : getPublishedFreeMaterials(activeTagSlug),
    getPublishedFreeMaterialTags(),
    linksViewActive
      ? getPublishedFreeMaterialLinks()
      : Promise.resolve([]),
  ]);

  return (
    <div className="site-container pb-20 md:pb-28">
      <FreeMaterialsHero />
      <FreeMaterialsListing
        materials={materials}
        links={links}
        tags={tags}
        activeTagSlug={activeTagSlug}
        linksViewActive={linksViewActive}
      />
    </div>
  );
}
