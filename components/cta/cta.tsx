import { AsteriskIcon } from "lucide-react";
import Link from "next/link";

import { ctaContent } from "./cta.utils";

export function Cta() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-20 text-white md:py-28 dark:bg-[#d7ff00] dark:text-zinc-950">
      <AsteriskIcon
        strokeWidth={1.5}
        aria-hidden="true"
        className="pointer-events-none absolute top-8 left-8 size-24 text-[#3d2010]/60 md:top-12 md:left-16 md:size-32 dark:text-[#9ea015]/50"
      />

      <svg
        viewBox="0 0 90 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        aria-hidden="true"
        className="pointer-events-none absolute right-8 bottom-8 h-5 w-28 text-[#1a4dff]/40 md:right-16 md:bottom-12 dark:text-[#9ea015]/60"
      >
        <path d="M2 9 Q 11 0 20 9 T 38 9 T 56 9 T 74 9 T 88 9" />
      </svg>

      <div className="relative mx-auto max-w-410 px-8 text-center">
        <h2 className="text-4xl leading-[1.05] font-black tracking-[-0.02em] md:text-6xl">
          {ctaContent.heading}{" "}
          <span className="text-[#ff4b12]">{ctaContent.headingAccent}</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-400 dark:text-zinc-800">
          {ctaContent.description}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={ctaContent.primaryCta.href}
            className="cursor-pointer rounded-[5px] bg-[#ff4b12] px-6 py-3.5 text-sm leading-none font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-105 dark:bg-zinc-950 dark:text-white"
          >
            {ctaContent.primaryCta.label}
          </Link>
          <Link
            href={ctaContent.secondaryCta.href}
            className="cursor-pointer rounded-[5px] border-2 border-white bg-transparent px-6 py-3 text-sm leading-none font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-105 dark:border-zinc-950 dark:text-zinc-950"
          >
            {ctaContent.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
