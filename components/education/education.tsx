"use client";

import { Reveal } from "@/components/reveal";

import { educationListItems } from "./education.utils";

export function Education() {
  return (
    <section className="relative overflow-hidden bg-[#f1eee5] py-20 md:py-28 dark:bg-[#1a1919]">
      <div className="site-container-wide">
        <Reveal className="relative max-w-2xl">
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
                    - {item.description}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
