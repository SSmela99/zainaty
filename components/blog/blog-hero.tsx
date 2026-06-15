import { AsteriskIcon } from "lucide-react";

export function BlogHero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-10 md:pt-20 md:pb-14">
      <AsteriskIcon
        strokeWidth={1.5}
        aria-hidden
        className="pointer-events-none absolute top-8 right-0 hidden size-28 text-[#ff4b12]/15 md:block dark:text-[#d7ff00]/15"
      />

      <svg
        aria-hidden
        viewBox="0 0 120 40"
        className="pointer-events-none absolute top-24 left-0 h-10 w-24 text-[#1a4dff]/40"
      >
        <path
          d="M0 20 C20 0, 40 40, 60 20 S100 0, 120 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative">
        <p className="text-[13px] font-bold tracking-[0.22em] text-[#1a4dff] uppercase">
          Blog
        </p>
        <h1 className="mt-5 text-4xl leading-[1.08] font-black tracking-[-0.03em] text-zinc-950 md:text-6xl dark:text-white">
          Wiedza bez{" "}
          <span className="text-[#ff4b12] dark:text-[#d7ff00]">technobełkotu</span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Artykuły o AI, technologii i produktywności — napisane po ludzku, bez
          skrótów i bez presji.
        </p>
      </div>
    </section>
  );
}
