import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import type { NewsItem } from "@/lib/news/types";
import { cn } from "@/lib/utils";

const BADGE_TONES: Record<
  NewsItem["badgeTone"],
  string
> = {
  orange:
    "bg-[#f24a00]/15 text-[#f24a00] dark:bg-[#daff02]/15 dark:text-[#daff02]",
  blue: "bg-[#0033ff]/15 text-[#0033ff] dark:bg-[#6688ff]/20 dark:text-[#6688ff]",
  purple:
    "bg-[#6b1cb1]/15 text-[#6b1cb1] dark:bg-[#b57ae0]/20 dark:text-[#b57ae0]",
  red: "bg-[#f24a00]/15 text-[#c23a00] dark:bg-[#ff8a7a]/20 dark:text-[#ff8a7a]",
};

type HomeNewsCardProps = {
  item: NewsItem;
};

export function HomeNewsCard({ item }: HomeNewsCardProps) {
  return (
    <Link
      href={item.href}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl bg-[#f1eee5] transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] dark:bg-[#1c1c1c] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.34)]"
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-[#ddd2c2] dark:bg-[#151414]">
        {item.cover_image_url ? (
          <Image
            src={item.cover_image_url}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-xl font-black tracking-[-0.03em] text-[#f24a00] dark:text-[#daff02]">
            {item.title}
          </div>
        )}

        <span
          className={cn(
            "absolute top-3.5 left-3.5 rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm",
            BADGE_TONES[item.badgeTone],
          )}
        >
          {item.badgeLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-4 pb-5 md:px-5 md:pt-5 md:pb-5">
        <h3 className="line-clamp-2 text-base leading-snug font-black tracking-[-0.02em] text-zinc-950 md:text-[17px] dark:text-white">
          {item.title}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-sm font-bold text-[#f24a00] transition-opacity group-hover:opacity-80 dark:text-[#daff02]">
            {item.ctaLabel}
          </span>

          <span
            aria-hidden
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e8e0d4] text-zinc-950 transition-all duration-300 ease-out group-hover:bg-[#f24a00] group-hover:text-white dark:bg-[#2a2a2a] dark:text-white dark:group-hover:bg-[#daff02] dark:group-hover:text-zinc-950"
          >
            <ArrowRightIcon className="size-3.5" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </Link>
  );
}
