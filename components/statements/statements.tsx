import { AsteriskIcon } from "lucide-react";

import { statements } from "./statements.utils";

export function Statements() {
  return (
    <section className="relative overflow-hidden bg-[#f2efe6] py-20 md:py-28 dark:bg-[#111111]">
      <AsteriskIcon
        strokeWidth={1.5}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 size-32 -translate-y-1/2 text-[#ff4b12]/15 md:left-16 md:size-48 dark:text-[#9ea015]/20"
      />

      <svg
        viewBox="0 0 60 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="pointer-events-none absolute right-8 bottom-12 h-9 w-20 text-[#3b6dff]/40 md:right-16 dark:text-[#1a4dff]/50"
      >
        <path d="M2 22 L 12 6 L 22 22 L 32 6 L 42 22 L 52 6" />
      </svg>

      <div className="relative mx-auto max-w-410 px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-14 md:gap-20">
          {statements.map((statement) => (
            <div
              key={statement.id}
              className={`group flex cursor-default flex-col items-center ${statement.rotation}`}
            >
              <div className="flex items-center gap-4 md:gap-5">
                <AsteriskIcon
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className={`size-14 shrink-0 origin-center opacity-50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.2] group-hover:opacity-100 md:size-16 lg:size-20 ${statement.palette.icon}`}
                />

                <p className="text-2xl leading-tight font-black tracking-[-0.02em] text-zinc-950 md:text-4xl lg:text-5xl dark:text-white">
                  {statement.prefix}
                  <span className={statement.palette.accent}>{statement.accent}</span>
                  {statement.suffix}
                </p>
              </div>

              <div
                aria-hidden="true"
                className={`mt-4 h-1.5 w-16 origin-center rounded-full transition-transform duration-300 ease-out group-hover:scale-x-[2] md:mt-5 md:w-20 ${statement.palette.underline}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
