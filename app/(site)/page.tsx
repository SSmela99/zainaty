import type { Metadata } from "next";

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

export default function Home() {
  return (
    <>
      <Hero />
      <HomeNewsSection />
      <Audience />
      <Education />
      <FeaturedCoursesSection />
      <Testimonials />
      <Statements />
      <HomeBlogSection />
      <Consultation />
      <Newsletter />
      <Cta />
    </>
  );
}
