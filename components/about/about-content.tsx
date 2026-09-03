import { Reveal } from "@/components/reveal";

import {
  aboutQuoteStyles,
  aboutQuotes,
} from "./about-content.utils";

export function AboutContent() {
  const [paceQuote, startQuote] = aboutQuotes;

  return (
    <section className="bg-[#e8e4d8] py-16 pb-12 md:py-20 md:pb-16 dark:bg-[#151414]">
      <div className="site-container">
        <Reveal className="mx-auto max-w-3xl space-y-6 text-base leading-7 text-zinc-700 md:text-lg md:leading-8 dark:text-zinc-300">
          <p>
            <strong className="font-black text-zinc-950 dark:text-white">
              Z AI na Ty
            </strong>{" "}
            powstało z obserwacji, że technologia zmienia się szybciej, niż
            większość ludzi ma czas ją ogarnąć. Niewiele osób tłumaczy to tak,
            żeby dało się to zrozumieć bez wcześniejszego doświadczenia z
            komputerami.
          </p>

          <p>
            Widzimy, jak wiele osób czuje się zagubionych w świecie AI,
            automatyzacji i nowych narzędzi. Słyszą, że trzeba się uczyć, ale nie
            wiedzą, od czego zacząć. Boją się, że jest już za późno, że to nie
            dla nich.
          </p>

          <AboutQuote quote={paceQuote} />

          <p>
            Nasza misja jest prosta:{" "}
            <strong className="font-black text-zinc-950 dark:text-white">
              sprawić, by technologia była dostępna dla każdego.
            </strong>{" "}
            Niezależnie od wieku, doświadczenia czy tego, jak bardzo „nie czujesz
            się technicznie”.
          </p>

          <p>
            Tworzymy materiały edukacyjne, które są jasne, praktyczne i
            przyjazne. Piszemy prostym językiem i nie zakładamy, że coś jest
            oczywiste tylko dlatego, że dla nas takie jest.
          </p>

          <AboutQuote quote={startQuote} />
        </Reveal>
      </div>
    </section>
  );
}

type AboutQuoteProps = {
  quote: (typeof aboutQuotes)[number];
};

function AboutQuote({ quote }: AboutQuoteProps) {
  const styles = aboutQuoteStyles[quote.variant];

  return (
    <blockquote
      className={`rounded-r-2xl border-l-4 px-6 py-5 text-base leading-7 font-black text-zinc-950 md:px-8 md:py-6 md:text-lg md:leading-8 dark:text-white ${styles.border} ${styles.background}`}
    >
      „{quote.text}”
    </blockquote>
  );
}
