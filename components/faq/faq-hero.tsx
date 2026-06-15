import { AsteriskIcon } from "lucide-react";

export function FaqHero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-10 text-center md:pt-20 md:pb-14">
      <AsteriskIcon
        strokeWidth={1.5}
        aria-hidden
        className="pointer-events-none absolute top-8 right-0 hidden size-28 text-[#ff4b12]/15 md:block dark:text-[#d7ff00]/15"
      />

      <div className="relative mx-auto max-w-3xl">
        <p className="text-[13px] font-bold tracking-[0.22em] text-[#1a4dff] uppercase">
          Pomoc
        </p>
        <h1 className="mt-5 text-4xl leading-[1.08] font-black tracking-[-0.03em] text-zinc-950 md:text-6xl dark:text-white">
          Najczęściej zadawane{" "}
          <span className="text-[#ff4b12] dark:text-[#d7ff00]">pytania</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Masz pytanie? Prawdopodobnie znajdziesz odpowiedź tutaj. Jeśli nie —
          napisz do nas!
        </p>
      </div>
    </section>
  );
}
