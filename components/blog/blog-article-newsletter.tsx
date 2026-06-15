import { MailIcon } from "lucide-react";

import { Input } from "@/components/ui/input";

export function BlogArticleNewsletter() {
  return (
    <div className="mt-12 w-full rounded-3xl border border-[#eadfce] bg-[#fff5ef] p-6 md:p-8 dark:border-zinc-700 dark:bg-[#1c1c1c]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#ff4b12] dark:bg-[#d7ff00]">
          <MailIcon
            strokeWidth={2.2}
            aria-hidden
            className="size-5 text-white dark:text-zinc-950"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <h2 className="text-lg font-black tracking-[-0.02em] text-zinc-950 dark:text-white">
            Podobał Ci się ten artykuł?
          </h2>

          <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="Twój adres e-mail"
              className="h-11 flex-1 rounded-xl border-[#ded9cf] bg-white px-4 text-sm text-zinc-950 placeholder:text-zinc-400 focus-visible:border-[#ff4b12]/40 focus-visible:ring-[#ff4b12]/15 dark:border-zinc-700 dark:bg-[#111111] dark:text-white dark:placeholder:text-zinc-500 dark:focus-visible:border-[#d7ff00]/40 dark:focus-visible:ring-[#d7ff00]/15"
            />
            <button
              type="submit"
              className="h-11 shrink-0 cursor-pointer rounded-xl bg-[#ff4b12] px-6 text-sm font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-105 dark:bg-[#d7ff00] dark:text-zinc-950"
            >
              Zapisz się
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
