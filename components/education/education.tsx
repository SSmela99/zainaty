import { AsteriskIcon } from "lucide-react";

import { educationListItems, educationStats } from "./education.utils";

export function Education() {
  return (
    <section className="relative overflow-hidden bg-[#f2efe6] py-20 md:py-28 dark:bg-[#111111]">
      <div className="mx-auto max-w-410 px-8">
        <div className="relative grid items-center gap-16 lg:grid-cols-2">
          <div className="relative">
            <AsteriskIcon
              strokeWidth={1.5}
              aria-hidden="true"
              className="pointer-events-none absolute -left-6 top-48 size-24 text-[#7c3aed]/25 dark:text-[#a78bfa]/25"
            />
            <div className="relative pl-12 lg:pl-16">
              <p className="text-[13px] font-bold tracking-[0.22em] text-[#1a4dff] uppercase">
                Co robimy
              </p>
              <h2 className="mt-6 text-5xl leading-[1.05] font-black tracking-[-0.02em] text-zinc-950 md:text-7xl dark:text-white">
                Edukacja{" "}
                <span className="text-[#ff4b12] dark:text-[#d7ff00]">bez</span>
                <br />
                presji
              </h2>
              <ul className="mt-10 space-y-5">
                {educationListItems.map((item) => (
                  <li
                    key={item.id}
                    className="group flex items-start gap-3 transition-transform duration-300 ease-out hover:translate-x-7.5"
                  >
                    <span className="mt-2 inline-block size-2.5 shrink-0 rounded-full bg-[#ff4b12] transition-transform duration-300 ease-out group-hover:scale-150 dark:bg-[#d7ff00]" />
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
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-8 right-10 size-32 rounded-full border-[6px] border-[#ff4b12] dark:border-[#d7ff00]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 -left-6 size-20 rounded-2xl bg-[#1a4dff]"
            />

            <div className="relative grid grid-cols-2 gap-4 rounded-3xl bg-white p-6 shadow-xl dark:bg-[#1c1c1c] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
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
          </div>
        </div>
      </div>
    </section>
  );
}
