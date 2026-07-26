import { AsteriskIcon } from "lucide-react";

import { Floater } from "@/components/hero/floater";
import { Reveal } from "@/components/reveal";
import { getPublishedTestimonials } from "@/lib/testimonials/queries";

import { TestimonialCard } from "./testimonial-card";

export async function Testimonials() {
  const testimonials = await getPublishedTestimonials();

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#e8e4d8] py-20 md:py-28 dark:bg-[#151414]">
      <Floater className="top-16 right-4 md:right-16" duration={6} delay={0.1}>
        <AsteriskIcon
          strokeWidth={1.5}
          aria-hidden="true"
          className="size-32 text-[#6b1cb1]/20 md:size-48 dark:text-[#b57ae0]/15"
        />
      </Floater>

      <Reveal className="relative z-10 mx-auto max-w-425 px-14 md:px-20">
        <div>
          <p className="text-[13px] font-bold tracking-[0.22em] text-[#0033ff] uppercase dark:text-[#6688ff]">
            Opinie
          </p>
          <h2 className="mt-4 text-3xl leading-[1.1] font-black tracking-[0.02em] text-zinc-950 md:text-5xl dark:text-white">
            Co mówią{" "}
            <span className="text-[#f24a00] dark:text-[#daff02]">
              nasi uczniowie
            </span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
