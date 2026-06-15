import { SendIcon } from "lucide-react";

import { NEWSLETTER_SOURCE } from "@/lib/newsletter/constants";

import { NewsletterSubscribeForm } from "./newsletter-subscribe-form";
import { newsletterContent } from "./newsletter.utils";

export function Newsletter() {
  return (
    <section className="bg-[#f2efe6] py-20 md:py-28 dark:bg-[#111111]">
      <div className="mx-auto max-w-410 px-8">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white px-8 py-12 text-center shadow-sm md:px-14 md:py-16 dark:bg-[#1c1c1c] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-[#ffe1cc] dark:bg-[#3a3d10]">
            <SendIcon
              strokeWidth={2.2}
              aria-hidden="true"
              className="size-5 text-[#ff4b12] dark:text-[#d7ff00]"
            />
          </div>

          <p className="mt-6 text-[13px] font-bold tracking-[0.22em] text-[#1a4dff] uppercase">
            {newsletterContent.label}
          </p>

          <h2 className="mt-4 text-3xl leading-[1.1] font-black tracking-[-0.02em] text-zinc-950 md:text-4xl dark:text-white">
            {newsletterContent.heading}{" "}
            <span className="text-[#ff4b12] dark:text-[#d7ff00]">
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
            inputClassName="h-12 flex-1 rounded-xl border-transparent bg-[#f2efe6] px-4 text-base text-zinc-950 placeholder:text-zinc-400 focus-visible:border-[#ff4b12]/30 focus-visible:ring-[#ff4b12]/20 dark:border-white/10 dark:bg-[#111111] dark:text-white dark:placeholder:text-zinc-500 dark:focus-visible:border-[#d7ff00]/30 dark:focus-visible:ring-[#d7ff00]/20"
            buttonClassName="h-12 shrink-0 cursor-pointer rounded-xl bg-[#ff4b12] px-7 text-sm font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 dark:bg-[#d7ff00] dark:text-zinc-950"
          />

          <p className="mt-5 text-xs text-zinc-500 dark:text-zinc-500">
            {newsletterContent.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
