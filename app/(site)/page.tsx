import { Audience } from "@/components/audience";
import { Consultation } from "@/components/consultation";
import { Cta } from "@/components/cta";
import { Education } from "@/components/education";
import { FeaturedCoursesSection } from "@/components/featured-courses";
import { Hero } from "@/components/hero";
import { HomeBlogSection } from "@/components/home-blog";
import { Newsletter } from "@/components/newsletter";
import { Statements } from "@/components/statements";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return (
    <>
      <Hero />
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
