import { AsteriskIcon } from "lucide-react";

import { Floater } from "@/components/hero/floater";
import { HeroReveal } from "@/components/hero/hero-reveal";

export function FaqHero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-10 text-center md:pt-20 md:pb-14">
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

      <HeroReveal className="relative z-10 mx-auto max-w-3xl">
        <p className="text-[13px] font-bold tracking-[0.22em] text-[#0033ff] uppercase">
          Pomoc
        </p>
        <h1 className="mt-5 text-4xl leading-[1.08] font-black tracking-[-0.03em] text-zinc-950 md:text-6xl dark:text-white">
          Najczęściej zadawane{" "}
          <span className="text-[#f24a00] dark:text-[#daff02]">pytania</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Masz pytanie? Prawdopodobnie znajdziesz odpowiedź tutaj. Jeśli nie —
          napisz do nas!
        </p>
      </HeroReveal>
    </section>
  );
}
