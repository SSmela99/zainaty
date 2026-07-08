import Link from "next/link";
import { ArrowRightIcon, TagIcon } from "lucide-react";

import { checkoutPath } from "@/lib/paths";

type CourseCheckoutPromoProps = {
  courseSlug: string;
};

export function CourseCheckoutPromo({ courseSlug }: CourseCheckoutPromoProps) {
  return (
    <div className="rounded-3xl border border-[#ded9cf] bg-[#fffaf5] p-6 dark:border-[#282828] dark:bg-[#1a1a14]">
      <div className="flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#ffe1cc] dark:bg-[#3a3d10]">
          <TagIcon
            className="size-5 text-[#ff4b12] dark:text-[#d7ff00]"
            strokeWidth={2.2}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-black tracking-[-0.02em] text-zinc-950 dark:text-white">
            Masz kod rabatowy?
          </h2>
          <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Wpisz go na stronie zakupu i obniż cenę przed płatnością w Stripe.
          </p>
          <Link
            href={checkoutPath(courseSlug)}
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#ff4b12] transition-colors hover:text-[#1a4dff] dark:text-[#ff6b4a] dark:hover:text-[#d7ff00]"
          >
            Przejdź do zakupu
            <ArrowRightIcon className="size-4" strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </div>
  );
}
