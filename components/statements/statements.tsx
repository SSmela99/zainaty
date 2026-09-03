"use client";

import { AsteriskIcon } from "lucide-react";

import { Reveal } from "@/components/reveal";

import { statements } from "./statements.utils";

export function Statements() {
  return (
    <section className="relative overflow-hidden bg-[#f1eee5] py-20 md:py-28 dark:bg-[#1a1919]">
      <div className="relative z-10 site-container-wide">
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
