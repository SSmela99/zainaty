import { AsteriskIcon } from "lucide-react";

import { Floater } from "@/components/hero/floater";
import { HeroReveal } from "@/components/hero/hero-reveal";

import { FREE_MATERIALS_HERO } from "./free-materials.utils";

export function FreeMaterialsHero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-10 text-center md:pt-20 md:pb-12">
      <Floater
        className="top-10 left-[8%] hidden md:block"
        duration={4.5}
        delay={0.2}
      >
        <span
          aria-hidden
          className="block size-3 rounded-full bg-[#f24a00] dark:bg-[#f24a00]"
        />
      </Floater>

      <Floater
        className="top-6 right-[6%] hidden md:block"
        duration={6}
        delay={0}
      >
        <AsteriskIcon
          strokeWidth={1.4}
          aria-hidden
          className="size-24 text-zinc-300 dark:text-zinc-700"
        />
      </Floater>

      <Floater
        className="top-28 left-[4%] hidden md:block"
        duration={5.5}
        delay={0.4}
      >
        <svg
          aria-hidden
          viewBox="0 0 120 40"
          className="h-9 w-22 text-zinc-300 dark:text-zinc-600"
        >
          <path
            d="M0 20 C20 0, 40 40, 60 20 S100 0, 120 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </Floater>

      <HeroReveal className="relative z-10 mx-auto max-w-3xl">
        <p className="text-[13px] font-bold tracking-[0.22em] text-[#f24a00] uppercase dark:text-[#f24a00]">
          {FREE_MATERIALS_HERO.eyebrow}
        </p>
        <h1 className="mt-5 text-4xl leading-[1.08] font-black tracking-[-0.03em] text-zinc-950 md:text-6xl dark:text-white">
          {FREE_MATERIALS_HERO.title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {FREE_MATERIALS_HERO.description}
        </p>
      </HeroReveal>
    </section>
  );
}
