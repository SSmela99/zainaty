import { AsteriskIcon } from "lucide-react";

import { aboutHeroContent } from "./about-hero.utils";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-10 md:pt-20 md:pb-14">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-0 z-0 -translate-y-1/2 md:left-4 lg:left-8"
      >
        <svg
          viewBox="0 0 80 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="absolute -top-5 left-2 h-3 w-20 text-[#7c3aed]/50 md:-top-6 md:left-4 dark:text-[#a78bfa]/60"
        >
          <path d="M2 8 Q 7 1 12 8 T 22 8 T 32 8 T 42 8 T 52 8 T 62 8 T 72 8" />
        </svg>
        <div className="size-24 rounded-full bg-[#dfe5ff] md:size-32 dark:bg-[#1a2a5e]" />
      </div>

      <AsteriskIcon
        strokeWidth={1.5}
        aria-hidden
        className="pointer-events-none absolute -top-2 -right-6 z-0 size-36 text-[#ff4b12]/20 md:-right-4 md:top-2 md:size-44 lg:size-52 dark:text-[#9ea015]/35"
      />

      <div className="relative z-10 mx-auto max-w-350 px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[13px] font-bold tracking-[0.22em] text-[#1a4dff] uppercase">
            {aboutHeroContent.label}
          </p>
          <h1 className="mt-5 text-4xl leading-[1.08] font-black tracking-[-0.03em] text-zinc-950 md:text-6xl dark:text-white">
            {aboutHeroContent.title}{" "}
            <span className="text-[#ff4b12] dark:text-[#d7ff00]">
              {aboutHeroContent.titleAccent}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            {aboutHeroContent.description}
          </p>
        </div>
      </div>
    </section>
  );
}
