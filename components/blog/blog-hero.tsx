import { AsteriskIcon } from "lucide-react";

import { Floater } from "@/components/hero/floater";
import { HeroReveal } from "@/components/hero/hero-reveal";

export function BlogHero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-10 md:pt-20 md:pb-14">
      <Floater
        className="top-8 right-0 hidden md:block"
        duration={6}
        delay={0}
      >
        <AsteriskIcon
          strokeWidth={1.5}
          aria-hidden
          className="size-28 text-[#f24a00]/15 dark:text-[#daff02]/15"
        />
      </Floater>

      <Floater className="top-24 left-0" duration={5.4} delay={0.35}>
        <svg
          aria-hidden
          viewBox="0 0 120 40"
          className="h-10 w-24 text-[#0033ff]/40"
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

      <HeroReveal className="relative z-10">
        <p className="text-[13px] font-bold tracking-[0.22em] text-[#0033ff] uppercase">
          Blog
        </p>
        <h1 className="mt-5 text-4xl leading-[1.08] font-black tracking-[-0.03em] text-zinc-950 md:text-6xl dark:text-white">
          Wiedza bez{" "}
          <span className="text-[#f24a00] dark:text-[#daff02]">technobełkotu</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Artykuły o AI, technologii i produktywności — napisane po ludzku, bez
          skrótów i bez presji.
        </p>
      </HeroReveal>
    </section>
  );
}
