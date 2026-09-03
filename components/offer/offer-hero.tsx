import { HeroReveal } from "@/components/hero/hero-reveal";

import { offerHeroContent } from "./offer-hero.utils";

export function OfferHero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-10 text-center md:pt-20 md:pb-14">
      <HeroReveal className="relative z-10 mx-auto max-w-3xl px-5 md:px-8">
        <p className="text-[13px] font-bold tracking-[0.22em] text-[#0033ff] uppercase">
          {offerHeroContent.label}
        </p>
        <h1 className="mt-5 text-4xl leading-[1.08] font-black tracking-[0.02em] text-zinc-950 md:text-6xl dark:text-white">
          {offerHeroContent.title}{" "}
          <span className="text-[#f24a00] dark:text-[#daff02]">
            {offerHeroContent.titleAccent}
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {offerHeroContent.description}
        </p>
      </HeroReveal>
    </section>
  );
}
