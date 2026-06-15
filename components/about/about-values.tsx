import {
  HandHeartIcon,
  HeartIcon,
  LightbulbIcon,
  RocketIcon,
} from "lucide-react";

import {
  ABOUT_VALUE_ICON,
  aboutValueCards,
  aboutValuesContent,
  type AboutValueIcon,
} from "./about-values.utils";

const ABOUT_VALUE_ICONS = {
  [ABOUT_VALUE_ICON.HEART]: HeartIcon,
  [ABOUT_VALUE_ICON.LIGHTBULB]: LightbulbIcon,
  [ABOUT_VALUE_ICON.HAND_HEART]: HandHeartIcon,
  [ABOUT_VALUE_ICON.ROCKET]: RocketIcon,
} satisfies Record<AboutValueIcon, typeof HeartIcon>;

export function AboutValues() {
  return (
    <section className="relative overflow-hidden py-16 pb-12 md:py-24 md:pb-16">
      <svg
        viewBox="0 0 60 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        aria-hidden
        className="pointer-events-none absolute right-4 bottom-8 hidden h-8 w-16 text-[#7c3aed]/30 md:block dark:text-[#a78bfa]/25"
      >
        <path d="M4 22 L14 8 L24 22 L34 8 L44 22 L54 8" />
      </svg>

      <div className="relative mx-auto max-w-275 px-8">
        <div className="text-center">
          <p className="text-[13px] font-bold tracking-[0.22em] text-[#1a4dff] uppercase">
            {aboutValuesContent.label}
          </p>
          <h2 className="mt-5 text-4xl leading-[1.08] font-black tracking-[-0.03em] text-zinc-950 md:text-5xl dark:text-white">
            {aboutValuesContent.title}{" "}
            <span className="text-[#ff4b12] dark:text-[#d7ff00]">
              {aboutValuesContent.titleAccent}
            </span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-14 md:gap-8">
          {aboutValueCards.map((card) => {
            const Icon = ABOUT_VALUE_ICONS[card.iconKey];

            return (
              <article
                key={card.id}
                className="group rounded-2xl bg-white p-7 shadow-sm ring-2 ring-transparent transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:ring-[#ff4b12] md:p-8 dark:bg-[#1c1c1c] dark:shadow-none dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.5)] dark:hover:ring-[#d7ff00]"
              >
                <div
                  className={`flex size-12 items-center justify-center rounded-xl transition-colors duration-300 ease-out ${card.palette.box} ${card.palette.boxHover}`}
                >
                  <Icon
                    strokeWidth={2.2}
                    className={`size-5 transition-colors duration-300 ease-out ${card.palette.icon} ${card.palette.iconHover}`}
                  />
                </div>
                <h3 className="mt-6 text-lg font-black tracking-[-0.02em] text-zinc-950 md:text-xl dark:text-white">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600 md:text-base dark:text-zinc-400">
                  {card.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
