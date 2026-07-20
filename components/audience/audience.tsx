"use client";

import { Reveal } from "@/components/reveal";

import { audienceCards } from "./audience.utils";

export function Audience() {
  return (
    <section className="bg-[#e8e4d8] py-16 dark:bg-[#151414] md:py-24">
      <div className="mx-auto max-w-410 px-8">
        <Reveal>
          <div>
            <p className="text-[13px] font-bold tracking-[0.22em] text-[#0033ff] uppercase dark:text-[#6688ff]">
              Dla kogo
            </p>
            <h2 className="mt-4 text-3xl leading-[1.1] font-black tracking-[-0.03em] text-zinc-950 md:text-5xl dark:text-white">
              Uczymy tych, którzy chcą{" "}
              <span className="text-[#f24a00] dark:text-[#daff02]">
                iść dalej z AI
              </span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
          {audienceCards.map(
            ({ id, Icon, palette, title, description }, index) => (
              <Reveal key={id} delay={index * 0.12} className="h-full">
                <article className="group h-full rounded-2xl bg-[#f7f4eb] p-7 shadow-sm ring-2 ring-transparent transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:ring-[#f24a00] dark:bg-[#1c1c1c] dark:shadow-none dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.5)] dark:hover:ring-[#daff02]">
                  <div
                    className={`flex size-12 items-center justify-center rounded-xl transition-colors duration-300 ease-out ${palette.box} ${palette.boxHover}`}
                  >
                    <Icon
                      strokeWidth={2.2}
                      className={`size-5 transition-colors duration-300 ease-out ${palette.icon} ${palette.iconHover}`}
                    />
                  </div>
                  <h3 className="mt-7 text-lg leading-snug font-black tracking-[-0.02em] text-zinc-950 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {description}
                  </p>
                </article>
              </Reveal>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
