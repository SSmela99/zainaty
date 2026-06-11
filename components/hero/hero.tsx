import { Floater } from "./floater";
import { heroDecorations } from "./hero.utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f2efe6] text-zinc-950 dark:bg-[#111111] dark:text-white">
      <div className="relative mx-auto max-w-410 px-8 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="relative mx-auto flex max-w-4xl flex-col">
          {heroDecorations.map((decoration) => (
            <Floater
              key={decoration.id}
              className={decoration.className}
              duration={decoration.duration}
              delay={decoration.delay}
            >
              {decoration.icon}
            </Floater>
          ))}

          <h1 className="text-6xl leading-[1.05] font-black tracking-[-0.04em] md:text-[5.5rem]">
            <span>Technologia </span>
            <span className="text-[#ff4b12] dark:text-[#d7ff00]">po</span>
            <br />
            <span className="text-[#ff4b12] dark:text-[#d7ff00]">ludzku.</span>
            <br />
            <span>Z AI na Ty — </span>
            <span className="text-[#1a4dff]">krok</span>
            <br />
            <span className="text-[#1a4dff]">po kroku.</span>
          </h1>

          <p className="mt-10 max-w-lg text-base leading-7 text-zinc-700 dark:text-zinc-300">
            Uczymy, jak korzystać z technologii i AI bez stresu, bez skrótów i
            bez technobełkotu. Dla każdego — niezależnie od wieku i doświadczenia.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#"
              className="cursor-pointer rounded-[5px] bg-[#ff4b12] px-6 py-3.5 text-sm leading-none font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-105 dark:bg-[#d7ff00] dark:text-zinc-950"
            >
              Zobacz e-booki
            </a>
            <a
              href="#"
              className="cursor-pointer rounded-[5px] border-2 border-[#1a4dff] bg-transparent px-6 py-3 text-sm leading-none font-black text-[#1a4dff] transition-transform hover:-translate-y-0.5 hover:scale-105"
            >
              Poznaj nas
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
