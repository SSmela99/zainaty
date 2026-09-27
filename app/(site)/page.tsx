import type { Metadata } from "next";
import { Suspense } from "react";

import { Audience } from "@/components/audience";
import { Consultation } from "@/components/consultation";
import { Cta } from "@/components/cta";
import { Education } from "@/components/education";
import { FeaturedCoursesSection } from "@/components/featured-courses";
import { Hero } from "@/components/hero";
import { HomeBlogSection } from "@/components/home-blog";
import { HomeNewsSection } from "@/components/home-news";
import { Newsletter } from "@/components/newsletter";
import { Statements } from "@/components/statements";
import { Testimonials } from "@/components/testimonials";
import { PATHS } from "@/lib/paths";
import { buildPageMetadata, SITE } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: `${SITE.name} - ${SITE.tagline.toLowerCase()}`,
  description: SITE.description,
  path: PATHS.HOME,
  absoluteTitle: true,
});

function HomeSectionFallback({ minHeight = "min-h-[240px]" }: { minHeight?: string }) {
  return (
    <div
      aria-hidden
      className={`${minHeight} animate-pulse bg-[#e8e4d8]/60 dark:bg-[#151414]/80`}
    />
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<HomeSectionFallback minHeight="min-h-[320px]" />}>
        <HomeNewsSection />
      </Suspense>
      <Audience />
      <Education />
      <Suspense fallback={<HomeSectionFallback minHeight="min-h-[360px]" />}>
        <FeaturedCoursesSection />
      </Suspense>
      <Suspense fallback={<HomeSectionFallback />}>
        <Testimonials />
      </Suspense>
      <Statements />
      <Suspense fallback={<HomeSectionFallback minHeight="min-h-[360px]" />}>
        <HomeBlogSection />
      </Suspense>
      <Consultation />
      <Newsletter />
      <Cta />
    </>
  );
}
