"use client";

import { Floater } from "@/components/hero/floater";
import { Reveal } from "@/components/reveal";

import { educationListItems, educationStats } from "./education.utils";

export function Education() {
  return (
    <section className="relative overflow-hidden bg-[#f1eee5] py-20 md:py-28 dark:bg-[#1a1919]">
      <div className="mx-auto max-w-425 px-14 md:px-20">
        <div className="relative grid items-center gap-16 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="relative">
              <p className="text-[13px] font-bold tracking-[0.22em] text-[#0033ff] uppercase">
                Co robimy
              </p>
              <h2 className="mt-6 text-5xl leading-[1.05] font-black tracking-[0.02em] text-zinc-950 md:text-7xl dark:text-white">
                Edukacja{" "}
                <span className="text-[#f24a00] dark:text-[#daff02]">bez</span>
                <br />
                presji
              </h2>
              <ul className="mt-10 space-y-5">
                {educationListItems.map((item) => (
                  <li
                    key={item.id}
                    className="group flex items-start gap-3 transition-transform duration-300 ease-out hover:translate-x-7.5"
                  >
                    <span className="mt-2 inline-block size-2.5 shrink-0 rounded-full bg-[#f24a00] transition-transform duration-300 ease-out group-hover:scale-150 dark:bg-[#daff02]" />
                    <p className="text-base text-zinc-950 dark:text-white">
                      <strong className="font-bold">{item.title}</strong>
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {" "}
                        — {item.description}
                      </span>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.18} className="relative">
            <Floater className="-top-8 right-10" duration={6.2} delay={0.1}>
              <div
                aria-hidden="true"
                className="size-32 rounded-full border-[6px] border-[#f24a00] dark:border-[#daff02]"
              />
            </Floater>
            <Floater className="-bottom-6 -left-6" duration={5.4} delay={0.5}>
              <div
                aria-hidden="true"
                className="size-20 rounded-2xl bg-[#0033ff]"
              />
            </Floater>

            <div className="relative z-10 grid grid-cols-2 gap-4 rounded-3xl bg-white p-6 shadow-xl dark:bg-[#1c1c1c] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
              {educationStats.map((stat) => (
                <div
                  key={stat.id}
                  className={`rounded-2xl py-10 text-center transition-all duration-300 ease-out hover:brightness-[1.2] ${stat.palette.bg}`}
                >
                  <div
                    className={`text-4xl font-black tracking-tight ${stat.palette.value}`}
                  >
                    {stat.value}
                  </div>
                  <div
                    className={`mt-1 text-sm font-medium ${stat.palette.label}`}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
