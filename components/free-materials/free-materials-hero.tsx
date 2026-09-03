import { HeroReveal } from "@/components/hero/hero-reveal";

import { FREE_MATERIALS_HERO } from "./free-materials.utils";

export function FreeMaterialsHero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-10 text-center md:pt-20 md:pb-12">
      <HeroReveal className="relative z-10 mx-auto max-w-3xl">
        <p className="text-[13px] font-bold tracking-[0.22em] text-[#0033ff] uppercase">
          {FREE_MATERIALS_HERO.eyebrow}
        </p>
        <h1 className="mt-5 text-4xl leading-[1.08] font-black tracking-[0.02em] text-zinc-950 md:text-6xl dark:text-white">
          {FREE_MATERIALS_HERO.title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {FREE_MATERIALS_HERO.description}
        </p>
      </HeroReveal>
    </section>
  );
}
