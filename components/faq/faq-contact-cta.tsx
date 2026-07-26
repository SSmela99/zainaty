import { MailIcon, MessagesSquareIcon } from "lucide-react";

import { Reveal } from "@/components/reveal";

const CONTACT_EMAIL = "kontakt@zainaty.pl";

export function FaqContactCta() {
  return (
    <section className="mx-auto mt-14 max-w-3xl md:mt-16">
      <Reveal>
        <div className="rounded-3xl bg-white px-6 py-10 text-center shadow-[0_2px_12px_rgba(0,0,0,0.06)] md:px-10 md:py-12 dark:bg-[#1c1c1c] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)]">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#ffd0bc] dark:bg-[#3a4500]">
            <MessagesSquareIcon
              strokeWidth={2.2}
              aria-hidden
              className="size-6 text-[#f24a00] dark:text-[#daff02]"
            />
          </div>

          <h2 className="mt-5 text-xl font-black tracking-[0.02em] text-zinc-950 md:text-2xl dark:text-white">
            Nie znalazłeś odpowiedzi?
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-600 md:text-base dark:text-zinc-400">
            Skontaktuj się z nami — chętnie odpowiemy na wszystkie Twoje pytania.
          </p>

          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#f24a00] px-6 py-3.5 text-sm font-black text-white transition-transform duration-300 ease-out hover:-translate-y-0.5 hover:scale-105 dark:bg-[#daff02] dark:text-zinc-950"
          >
            <MailIcon strokeWidth={2.2} className="size-4" />
            Napisz do nas
          </a>
        </div>
      </Reveal>
    </section>
  );
}
