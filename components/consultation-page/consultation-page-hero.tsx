import { AsteriskIcon } from "lucide-react";

import { Floater } from "@/components/hero/floater";

import { consultationPageHero } from "./consultation-page.utils";

export function ConsultationPageHero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-10 text-center md:pt-20 md:pb-14">
      <Floater
        className="top-20 left-4 md:left-12"
        duration={5.5}
        delay={0.3}
      >
        <svg
          viewBox="0 0 90 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden
          className="h-5 w-28 text-[#6b1cb1]/40 dark:text-[#b57ae0]/50"
        >
          <path d="M2 9 Q 11 0 20 9 T 38 9 T 56 9 T 74 9 T 88 9" />
        </svg>
      </Floater>

      <Floater
        className="top-8 right-0 hidden md:block lg:right-8"
        duration={6}
        delay={0}
      >
        <AsteriskIcon
          strokeWidth={1.5}
          aria-hidden
          className="size-36 text-[#f24a00]/15 dark:text-[#daff02]/15"
        />
      </Floater>

      <div className="relative z-10 mx-auto max-w-3xl px-8">
        <p className="text-[13px] font-bold tracking-[0.22em] text-[#0033ff] uppercase dark:text-[#6688ff]">
          {consultationPageHero.label}
        </p>
        <h1 className="mt-5 text-4xl leading-[1.08] font-black tracking-[-0.03em] text-zinc-950 md:text-6xl dark:text-white">
          {consultationPageHero.title}{" "}
          <span className="text-[#f24a00] dark:text-[#daff02]">
            {consultationPageHero.titleAccent}
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {consultationPageHero.description}
        </p>
      </div>
    </section>
  );
}
