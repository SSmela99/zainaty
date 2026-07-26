"use client";

import { AsteriskIcon } from "lucide-react";

import { Floater } from "@/components/hero/floater";
import { Reveal } from "@/components/reveal";

import { statements } from "./statements.utils";

export function Statements() {
  return (
    <section className="relative overflow-hidden bg-[#f1eee5] py-20 md:py-28 dark:bg-[#1a1919]">
      <Floater
        className="top-1/2 left-4 -translate-y-1/2 md:left-16"
        duration={6.5}
        delay={0}
      >
        <AsteriskIcon
          strokeWidth={1.5}
          aria-hidden="true"
          className="size-32 text-[#f24a00]/15 md:size-48 dark:text-[#7a9e00]/20"
        />
      </Floater>

      <Floater
        className="right-8 bottom-12 md:right-16"
        duration={5.4}
        delay={0.5}
      >
        <svg
          viewBox="0 0 60 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-9 w-20 text-[#3355ff]/40 dark:text-[#0033ff]/50"
        >
          <path d="M2 22 L 12 6 L 22 22 L 32 6 L 42 22 L 52 6" />
        </svg>
      </Floater>

      <div className="relative z-10 mx-auto max-w-425 px-14 md:px-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-14 md:gap-20">
          {statements.map((statement, index) => (
            <Reveal key={statement.id} delay={index * 0.12}>
              <div className="group flex cursor-default flex-col items-center">
                <div className="flex items-center gap-4 md:gap-5">
                  <AsteriskIcon
                    strokeWidth={1.75}
                    aria-hidden="true"
                    className={`size-14 shrink-0 origin-center opacity-50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.2] group-hover:opacity-100 md:size-16 lg:size-20 ${statement.palette.icon}`}
                  />

                  <p className="text-2xl leading-tight font-black tracking-[0.02em] text-zinc-950 md:text-4xl lg:text-5xl dark:text-white">
                    {statement.prefix}
                    <span className={statement.palette.accent}>
                      {statement.accent}
                    </span>
                    {statement.suffix}
                  </p>
                </div>

                <div
                  aria-hidden="true"
                  className={`mt-4 h-1.5 w-16 origin-center rounded-full transition-transform duration-300 ease-out group-hover:scale-x-[2] md:mt-5 md:w-20 ${statement.palette.underline}`}
                />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
