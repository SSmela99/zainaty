import { Audience } from "@/components/audience";
import { Consultation } from "@/components/consultation";
import { Cta } from "@/components/cta";
import { Education } from "@/components/education";
import { Hero } from "@/components/hero";
import { Newsletter } from "@/components/newsletter";
import { Statements } from "@/components/statements";

export default function Home() {
  return (
    <>
      <Hero />
      <Audience />
      <Education />
      <Statements />
      <Consultation />
      <Newsletter />
      <Cta />
    </>
  );
}
