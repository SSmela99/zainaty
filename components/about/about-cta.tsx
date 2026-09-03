import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/reveal";

import { aboutCtaContent } from "./about-cta.utils";

export function AboutCta() {
  return (
    <section className="relative overflow-hidden bg-[#151414] py-20 text-white md:py-28 dark:bg-[#daff02] dark:text-zinc-950">
      <Reveal className="relative z-10 site-container-medium text-center">
        <h2 className="text-4xl leading-[1.05] font-black tracking-[0.02em] md:text-6xl">
          {aboutCtaContent.heading}{" "}
          <span className="text-[#f24a00]">{aboutCtaContent.headingAccent}</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-400 dark:text-zinc-800">
          {aboutCtaContent.description}
        </p>

        <Link
          href={aboutCtaContent.cta.href}
          className="mt-10 inline-flex cursor-pointer items-center gap-2 rounded-[5px] bg-[#f24a00] px-6 py-3.5 text-sm leading-none font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-105 dark:bg-zinc-950 dark:text-white"
        >
          {aboutCtaContent.cta.label}
          <ArrowRightIcon className="size-4" strokeWidth={2.5} />
        </Link>
      </Reveal>
    </section>
  );
}
