import Link from "next/link";

import { PATHS } from "@/lib/paths";

import { Floater } from "./floater";
import { HeroReveal } from "./hero-reveal";
import { heroDecorations } from "./hero.utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f1eee5] text-zinc-950 dark:bg-[#1a1919] dark:text-white">
      <div className="relative mx-auto max-w-410 px-8 pt-20 pb-24 md:pt-28 md:pb-32">
        {heroDecorations.map((decoration) => (
          <Floater
            key={decoration.id}
            className={decoration.className}
            duration={decoration.duration}
            delay={decoration.delay}
          >
            {decoration.icon}
          </Floater>
        ))}

        <HeroReveal className="relative z-10 mx-auto flex max-w-3xl flex-col lg:max-w-4xl">
          <h1 className="text-6xl leading-[1.05] font-black tracking-[-0.04em] md:text-[5.5rem]">
            <span>Technologia </span>
            <span className="text-[#f24a00] dark:text-[#daff02]">po</span>
            <br />
            <span className="text-[#f24a00] dark:text-[#daff02]">ludzku.</span>
            <br />
            <span>Z AI na Ty — </span>
            <span className="text-[#0033ff]">krok</span>
            <br />
            <span className="text-[#0033ff]">po kroku.</span>
          </h1>

          <p className="mt-10 max-w-lg text-base leading-7 text-zinc-700 dark:text-zinc-300">
            Uczymy, jak korzystać z technologii i AI bez stresu, bez skrótów i
            bez technobełkotu. Dla każdego — niezależnie od wieku i doświadczenia.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={PATHS.COURSES}
              className="cursor-pointer rounded-[5px] bg-[#f24a00] px-6 py-3.5 text-sm leading-none font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-105 dark:bg-[#daff02] dark:text-zinc-950"
            >
              Zobacz kursy
            </Link>
            <Link
              href={PATHS.ABOUT}
              className="cursor-pointer rounded-[5px] border-2 border-[#0033ff] bg-transparent px-6 py-3 text-sm leading-none font-black text-[#0033ff] transition-transform hover:-translate-y-0.5 hover:scale-105"
            >
              Poznaj nas
            </Link>
          </div>
        </HeroReveal>
      </div>
    </section>
  );
}
