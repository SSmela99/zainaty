import { AsteriskIcon } from "lucide-react";

import { getPublishedTestimonials } from "@/lib/testimonials/queries";

import { TestimonialCard } from "./testimonial-card";

export async function Testimonials() {
  const testimonials = await getPublishedTestimonials();

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden bg-[#ebe3d4] py-20 md:py-28 dark:bg-[#0a0a0a]">
      <AsteriskIcon
        strokeWidth={1.5}
        aria-hidden="true"
        className="pointer-events-none absolute top-16 left-4 size-32 text-[#7c3aed]/20 md:left-16 md:size-48 dark:text-[#a78bfa]/15"
      />

      <div className="relative mx-auto max-w-410 px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[13px] font-bold tracking-[0.22em] text-[#7c3aed] uppercase dark:text-[#a78bfa]">
            Opinie
          </p>
          <h2 className="mt-4 text-3xl leading-[1.1] font-black tracking-[-0.03em] text-zinc-950 md:text-5xl dark:text-white">
            Co mówią{" "}
            <span className="text-[#ff4b12] dark:text-[#d7ff00]">nasi uczniowie</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
