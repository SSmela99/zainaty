import { SendIcon } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { NEWSLETTER_SOURCE } from "@/lib/newsletter/constants";

import { NewsletterSubscribeForm } from "./newsletter-subscribe-form";
import { newsletterContent } from "./newsletter.utils";

export function Newsletter() {
  return (
    <section className="bg-[#f1eee5] py-20 md:py-28 dark:bg-[#1a1919]">
      <Reveal className="mx-auto max-w-425 px-14 md:px-20">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white px-8 py-12 text-center shadow-sm md:px-14 md:py-16 dark:bg-[#1c1c1c] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#ffd0bc] dark:bg-[#3a4500]">
            <SendIcon
              strokeWidth={2.2}
              aria-hidden="true"
              className="size-5 text-[#f24a00] dark:text-[#daff02]"
            />
          </div>

          <p className="mt-6 text-[13px] font-bold tracking-[0.22em] text-[#0033ff] uppercase">
            {newsletterContent.label}
          </p>

          <h2 className="mt-4 text-3xl leading-[1.1] font-black tracking-[0.02em] text-zinc-950 md:text-4xl dark:text-white">
            {newsletterContent.heading}{" "}
            <span className="text-[#f24a00] dark:text-[#daff02]">
              {newsletterContent.headingAccent}
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {newsletterContent.description}
          </p>

          <NewsletterSubscribeForm
            source={NEWSLETTER_SOURCE.SECTION}
            placeholder={newsletterContent.placeholder}
            submitLabel={newsletterContent.submitLabel}
            formClassName="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center"
            inputClassName="h-12 flex-1 rounded-xl border-transparent bg-[#f1eee5] px-4 text-base text-zinc-950 placeholder:text-zinc-400 focus-visible:border-[#f24a00]/30 focus-visible:ring-[#f24a00]/20 dark:border-white/10 dark:bg-[#151414] dark:text-white dark:placeholder:text-zinc-500 dark:focus-visible:border-[#daff02]/30 dark:focus-visible:ring-[#daff02]/20"
            buttonClassName="h-12 shrink-0 cursor-pointer rounded-xl bg-[#f24a00] px-7 text-sm font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 dark:bg-[#daff02] dark:text-zinc-950"
          />

          <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-500">
            {newsletterContent.disclaimer}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
