import {
  HandHeartIcon,
  HeartIcon,
  LightbulbIcon,
  RocketIcon,
} from "lucide-react";

import { Reveal } from "@/components/reveal";

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
      <div className="relative z-10 mx-auto w-full max-w-none px-5 md:max-w-275 md:px-8">
        <Reveal className="text-center">
          <p className="text-[13px] font-bold tracking-[0.22em] text-[#0033ff] uppercase">
            {aboutValuesContent.label}
          </p>
          <h2 className="mt-5 text-4xl leading-[1.08] font-black tracking-[0.02em] text-zinc-950 md:text-5xl dark:text-white">
            {aboutValuesContent.title}{" "}
            <span className="text-[#f24a00] dark:text-[#daff02]">
              {aboutValuesContent.titleAccent}
            </span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-14 md:gap-8">
          {aboutValueCards.map((card, index) => {
            const Icon = ABOUT_VALUE_ICONS[card.iconKey];

            return (
              <Reveal key={card.id} delay={index * 0.12} className="h-full">
                <article className="group h-full rounded-2xl bg-white p-7 shadow-sm ring-2 ring-transparent transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:ring-[#f24a00] md:p-8 dark:bg-[#1c1c1c] dark:shadow-none dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.5)] dark:hover:ring-[#daff02]">
                  <div
                    className={`flex size-12 items-center justify-center rounded-xl transition-colors duration-300 ease-out ${card.palette.box} ${card.palette.boxHover}`}
                  >
                    <Icon
                      strokeWidth={2.2}
                      className={`size-5 transition-colors duration-300 ease-out ${card.palette.icon} ${card.palette.iconHover}`}
                    />
                  </div>
                  <h3 className="mt-6 text-lg font-black tracking-[0.02em] text-zinc-950 md:text-xl dark:text-white">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600 md:text-base dark:text-zinc-400">
                    {card.description}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
