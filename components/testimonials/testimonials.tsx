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
      <Reveal className="relative z-10 site-container-wide">
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
