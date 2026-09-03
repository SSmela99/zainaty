import { FrownIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SiteShell } from "@/components/site-shell";
import { PATHS } from "@/lib/paths";

export const metadata: Metadata = {
  title: "Nie znaleziono strony",
  description:
    "Adres wygląda na nieaktualny albo strona zniknęła. Wróć na start Z AI na Ty.",
};

export default function NotFound() {
  return (
    <SiteShell>
      <section className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-24 text-zinc-950 md:px-8 dark:text-white">
        <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-10 -left-6 size-24 rounded-full border-[6px] border-[#0033ff]/30"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 bottom-0 size-20 rounded-2xl bg-[#ddcfde]/60 dark:bg-[#2a1230]/60"
        />

        <div className="flex items-center justify-center gap-2 md:gap-6">
          <span className="text-[7rem] leading-none font-black tracking-[-0.06em] text-[#f24a00] md:text-[12rem] dark:text-[#daff02]">
            4
          </span>
          <FrownIcon
            strokeWidth={1.8}
            className="size-28 animate-float text-[#0033ff] md:size-44"
            style={{ animationDuration: "4s" }}
            aria-hidden="true"
          />
          <span className="text-[7rem] leading-none font-black tracking-[-0.06em] text-[#f24a00] md:text-[12rem] dark:text-[#daff02]">
            4
          </span>
        </div>

        <h1 className="mt-8 text-3xl leading-[1.1] font-black tracking-[-0.03em] md:text-5xl">
          Nie znaleziono podanej strony
        </h1>

        <p className="mt-5 max-w-lg text-base leading-7 text-zinc-700 dark:text-zinc-300">
          Adres wygląda na nieaktualny albo strona zniknęła w cyfrowym
          eterze. Wróć na start — pomożemy Ci znaleźć to, czego szukasz.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={PATHS.HOME}
            className="cursor-pointer rounded-[5px] bg-[#f24a00] px-6 py-3.5 text-sm leading-none font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-105 dark:bg-[#daff02] dark:text-zinc-950"
          >
            Wróć na stronę główną
          </Link>
          <Link
            href={PATHS.COURSES}
            className="cursor-pointer rounded-[5px] border-2 border-[#0033ff] bg-transparent px-6 py-3 text-sm leading-none font-black text-[#0033ff] transition-transform hover:-translate-y-0.5 hover:scale-105"
          >
            Zobacz kursy
          </Link>
        </div>
        </div>
      </section>
    </SiteShell>
  );
}
