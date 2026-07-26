import { ArrowRightIcon, AsteriskIcon } from "lucide-react";
import Link from "next/link";

import { Floater } from "@/components/hero/floater";
import { Reveal } from "@/components/reveal";

import { aboutCtaContent } from "./about-cta.utils";

export function AboutCta() {
  return (
    <section className="relative overflow-hidden bg-[#151414] py-20 text-white md:py-28 dark:bg-[#daff02] dark:text-zinc-950">
      <Floater
        className="top-8 left-8 md:top-12 md:left-16"
        duration={6}
        delay={0}
      >
        <AsteriskIcon
          strokeWidth={1.5}
          aria-hidden
          className="size-24 text-[#3d2010]/60 md:size-32 dark:text-[#7a9e00]/50"
        />
      </Floater>

      <Floater
        className="right-8 bottom-8 md:right-16 md:bottom-12"
        duration={5.5}
        delay={0.4}
      >
        <svg
          viewBox="0 0 90 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden
          className="h-5 w-28 text-[#0033ff]/40 dark:text-[#7a9e00]/60"
        >
          <path d="M2 9 Q 11 0 20 9 T 38 9 T 56 9 T 74 9 T 88 9" />
        </svg>
      </Floater>

      <Reveal className="relative z-10 mx-auto max-w-410 px-8 text-center">
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
