import {
  aboutQuoteStyles,
  aboutQuotes,
} from "./about-content.utils";

export function AboutContent() {
  const [supportQuote, paceQuote] = aboutQuotes;

  return (
    <section className="bg-[#ebe3d4] py-16 pb-12 md:py-20 md:pb-16 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-350 px-8">
        <div className="mx-auto max-w-3xl space-y-6 text-base leading-7 text-zinc-700 md:text-lg md:leading-8 dark:text-zinc-300">
        <p>
          <strong className="font-black text-zinc-950 dark:text-white">
            Z AI na Ty
          </strong>{" "}
          powstało z prostej obserwacji: technologia rozwija się w zawrotnym
          tempie, ale nie wszyscy nadążają za zmianami. I to nie dlatego, że
          nie chcą — ale dlatego, że nikt nie wyjaśnia im tego w sposób
          zrozumiały.
        </p>

        <p>
          Widzimy, jak wiele osób czuje się zagubione w świecie AI,
          automatyzacji i nowych narzędzi. Słyszą wszędzie, że „trzeba się
          uczyć”, ale nie wiedzą, od czego zacząć. Boją się, że jest już za
          późno. Że to nie dla nich.
        </p>

        <AboutQuote quote={supportQuote} />

        <p>
          Nasza misja jest prosta:{" "}
          <strong className="font-black text-zinc-950 dark:text-white">
            sprawić, by technologia była dostępna dla każdego.
          </strong>{" "}
          Niezależnie od wieku, doświadczenia czy tego, jak bardzo „nie czujesz
          się technicznie”.
        </p>

        <p>
          Tworzymy materiały edukacyjne, które są{" "}
          <strong className="font-black text-zinc-950 dark:text-white">
            jasne, praktyczne i przyjazne.
          </strong>{" "}
          Bez technobełkotu. Bez skrótów myślowych. Bez zakładania, że „przecież
          to oczywiste”.
        </p>

        <AboutQuote quote={paceQuote} />
        </div>
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
