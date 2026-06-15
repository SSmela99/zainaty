import { AsteriskIcon } from "lucide-react";

import { offerHeroContent } from "./offer-hero.utils";

export function OfferHero() {
  return (
    <section className="relative overflow-hidden bg-[#ebe3d4] pt-16 pb-12 md:pt-24 md:pb-16 dark:bg-[#0a0a0a]">
      <AsteriskIcon
        strokeWidth={1.5}
        aria-hidden
        className="pointer-events-none absolute top-8 right-8 size-28 text-[#7c3aed]/20 md:right-16 md:size-32 dark:text-[#a78bfa]/20"
      />

      <div className="relative mx-auto max-w-350 px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <svg
              aria-hidden
              viewBox="0 0 80 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="pointer-events-none absolute -bottom-2 -left-4 z-0 h-3 w-20 text-[#ff4b12] dark:text-[#d7ff00]"
            >
              <path d="M2 8 Q 7 1 12 8 T 22 8 T 32 8 T 42 8 T 52 8 T 62 8 T 72 8" />
            </svg>

            <div className="relative z-10 min-h-72 rounded-3xl bg-white p-10 shadow-sm md:min-h-80 md:p-12 dark:bg-[#1c1c1c] dark:shadow-none">
              <AsteriskIcon
                strokeWidth={1.5}
                aria-hidden
                className="pointer-events-none absolute top-8 right-8 size-16 text-[#ecdcff] md:size-20 dark:text-[#d7ff00]/80"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-8 left-8 size-16 rounded-full bg-[#dfe5ff] md:size-20 dark:bg-[#1a2a5e]"
              />

              <div className="relative max-w-sm">
                <p className="text-[13px] font-bold tracking-[0.22em] text-[#1a4dff] uppercase">
                  {offerHeroContent.label}
                </p>
                <h1 className="mt-6 text-4xl leading-[1.08] font-black tracking-[-0.03em] text-zinc-950 md:text-5xl dark:text-white">
                  Jak możemy
                  <br />
                  <span className="text-zinc-950 dark:hidden">Ci </span>
                  <span className="text-[#ff4b12] dark:text-[#d7ff00]">
                    <span className="hidden dark:inline">Ci </span>
                    pomóc
                  </span>
                </h1>
              </div>
            </div>
          </div>

          <p className="text-base leading-7 text-zinc-600 md:text-lg dark:text-zinc-300">
            {offerHeroContent.description}
          </p>
        </div>
      </div>
    </section>
  );
}
