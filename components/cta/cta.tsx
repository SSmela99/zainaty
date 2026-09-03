import Link from "next/link";

import { Reveal } from "@/components/reveal";

import { ctaContent } from "./cta.utils";

export function Cta() {
  return (
    <section
      data-cursor-invert
      className="relative overflow-hidden bg-[#151414] py-20 text-white md:py-28 dark:bg-[#3d0a6e]"
    >
      <Reveal className="relative z-10 site-container-wide text-center">
        <h2 className="text-4xl leading-[1.05] font-black tracking-[0.02em] md:text-6xl">
          {ctaContent.heading}{" "}
          <span className="text-[#f24a00]">{ctaContent.headingAccent}</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-400 dark:text-white/80">
          {ctaContent.description}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={ctaContent.primaryCta.href}
            className="cursor-pointer rounded-[5px] bg-[#f24a00] px-6 py-3.5 text-sm leading-none font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-105"
          >
            {ctaContent.primaryCta.label}
          </Link>
          <Link
            href={ctaContent.secondaryCta.href}
            className="cursor-pointer rounded-[5px] border-2 border-white bg-transparent px-6 py-3 text-sm leading-none font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-105"
          >
            {ctaContent.secondaryCta.label}
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
