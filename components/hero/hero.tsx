import Link from "next/link";

import { PATHS } from "@/lib/paths";

import { HeroReveal } from "./hero-reveal";

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100dvh-4.5rem)] items-center overflow-hidden bg-[#f1eee5] text-zinc-950 dark:bg-[#1a1919] dark:text-white">
      <div className="relative site-container-wide py-16 md:py-20">
        <HeroReveal className="relative z-10 flex flex-col">
          <h1 className="text-[2.75rem] leading-[1.05] font-black tracking-[0.02em] sm:text-[3.5rem] md:text-[5rem] lg:text-[6.078rem]">
            <span className="block">
              Technologia{" "}
              <span className="text-[#f24a00] dark:text-[#daff02]">
                po ludzku.
              </span>
            </span>
            <span className="block">
              Z AI NA TY —{" "}
              <span className="text-[#0033ff]">krok po kroku.</span>
            </span>
          </h1>

          <p className="mt-10 max-w-2xl text-lg leading-8 text-zinc-950 md:text-xl md:leading-9 dark:text-white">
            Uczymy, jak korzystać z technologii i AI bez stresu, bez skrótów i
            bez technobełkotu. Dla każdego — niezależnie od wieku i doświadczenia.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3.5">
            <Link
              href={PATHS.COURSES}
              className="cursor-pointer rounded-[5px] bg-[#f24a00] px-[2.1rem] py-[1.2rem] text-[1.2rem] leading-none font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-105 dark:bg-[#daff02] dark:text-zinc-950"
            >
              Zobacz kursy
            </Link>
            <Link
              href={PATHS.ABOUT}
              className="cursor-pointer rounded-[5px] border-2 border-[#0033ff] bg-transparent px-[2.1rem] py-[1.05rem] text-[1.2rem] leading-none font-black text-[#0033ff] transition-transform hover:-translate-y-0.5 hover:scale-105"
            >
              Poznaj nas
            </Link>
          </div>
        </HeroReveal>
      </div>
    </section>
  );
}
