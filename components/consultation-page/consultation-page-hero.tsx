import { AsteriskIcon } from "lucide-react";

import { consultationPageHero } from "./consultation-page.utils";

export function ConsultationPageHero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-10 text-center md:pt-20 md:pb-14">
      <svg
        viewBox="0 0 90 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        aria-hidden
        className="pointer-events-none absolute top-20 left-4 h-5 w-28 text-[#7c3aed]/40 md:left-12 dark:text-[#a78bfa]/50"
      >
        <path d="M2 9 Q 11 0 20 9 T 38 9 T 56 9 T 74 9 T 88 9" />
      </svg>

      <AsteriskIcon
        strokeWidth={1.5}
        aria-hidden
        className="pointer-events-none absolute top-8 right-0 hidden size-36 text-[#ff4b12]/15 md:block lg:right-8 dark:text-[#d7ff00]/15"
      />

      <div className="relative mx-auto max-w-3xl px-8">
        <p className="text-[13px] font-bold tracking-[0.22em] text-[#1a4dff] uppercase dark:text-[#7d9bff]">
          {consultationPageHero.label}
        </p>
        <h1 className="mt-5 text-4xl leading-[1.08] font-black tracking-[-0.03em] text-zinc-950 md:text-6xl dark:text-white">
          {consultationPageHero.title}{" "}
          <span className="text-[#ff4b12] dark:text-[#d7ff00]">
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
