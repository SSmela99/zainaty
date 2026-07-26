import type { LegalSection } from "./legal.utils";

type LegalDocumentProps = {
  label: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
};

export function LegalDocument({
  label,
  title,
  description,
  lastUpdated,
  sections,
}: LegalDocumentProps) {
  return (
    <div className="mx-auto max-w-350 px-8 pb-20 md:pb-28">
      <section className="pt-16 pb-10 text-center md:pt-20 md:pb-14">
        <p className="text-[13px] font-bold tracking-[0.22em] text-[#0033ff] uppercase">
          {label}
        </p>
        <h1 className="mt-5 text-4xl leading-[1.08] font-black tracking-[0.02em] text-zinc-950 md:text-5xl dark:text-white">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-500">
          Ostatnia aktualizacja: {lastUpdated}
        </p>
      </section>

      <article className="mx-auto max-w-3xl space-y-10">
        {sections.map((section) => (
          <section key={section.id} className="space-y-4">
            <h2 className="text-xl font-black tracking-[0.02em] text-zinc-950 md:text-2xl dark:text-white">
              {section.title}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-7 text-zinc-700 dark:text-zinc-300"
              >
                {paragraph}
              </p>
            ))}
            {section.list ? (
              <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-zinc-700 dark:text-zinc-300">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </article>
    </div>
  );
}
