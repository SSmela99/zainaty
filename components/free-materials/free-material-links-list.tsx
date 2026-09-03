import { ExternalLinkIcon } from "lucide-react";

import { Reveal } from "@/components/reveal";
import type { FreeMaterialLink } from "@/lib/free-materials/types";

type FreeMaterialLinksListProps = {
  links: FreeMaterialLink[];
};

export function FreeMaterialLinksList({ links }: FreeMaterialLinksListProps) {
  if (links.length === 0) {
    return (
      <p className="mt-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Brak linków w tej kategorii.
      </p>
    );
  }

  return (
    <ul className="mt-10 grid gap-4 sm:grid-cols-2">
      {links.map((link, index) => (
        <li key={link.id}>
          <Reveal delay={index * 0.06} className="h-full">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-2xl border border-zinc-200/80 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] dark:border-zinc-800 dark:bg-[#1c1c1c] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-black tracking-[0.01em] text-zinc-950 dark:text-white">
                  {link.title}
                </h3>
                <ExternalLinkIcon
                  className="mt-0.5 size-4 shrink-0 text-zinc-400 transition-colors group-hover:text-[#f24a00] dark:group-hover:text-[#daff02]"
                  strokeWidth={2.3}
                />
              </div>
              <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {link.description}
              </p>
              <p className="mt-3 truncate text-xs font-medium text-[#0033ff] dark:text-[#b57ae0]">
                {link.url.replace(/^https?:\/\//, "")}
              </p>
            </a>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
