import { DownloadIcon } from "lucide-react";

import type { LegalBlock, LegalDownload, LegalSection } from "./legal.utils";

type LegalDocumentProps = {
  label: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
  downloads?: readonly LegalDownload[];
};

function resolveBlocks(section: LegalSection): readonly LegalBlock[] {
  if (section.blocks) {
    return section.blocks;
  }

  return [
    ...(section.paragraphs?.map(
      (text) => ({ type: "paragraph" as const, text }),
    ) ?? []),
    ...(section.list ? [{ type: "list" as const, items: section.list }] : []),
  ];
}

function SectionBody({ section }: { section: LegalSection }) {
  const blocks = resolveBlocks(section);

  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "list") {
          return (
            <ul
              key={`${section.id}-list-${index}`}
              className="list-disc space-y-2 pl-5 text-base leading-7 text-zinc-700 dark:text-zinc-300"
            >
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "table") {
          return (
            <div
              key={`${section.id}-table-${index}`}
              className="-mx-1 overflow-x-auto"
            >
              <table className="w-full min-w-xl border-collapse text-left text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-700">
                    {block.table.headers.map((header) => (
                      <th
                        key={header}
                        className="px-3 py-2.5 align-top font-bold text-zinc-950 dark:text-white"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.table.rows.map((row, rowIndex) => (
                    <tr
                      key={`${section.id}-row-${rowIndex}`}
                      className="border-b border-zinc-100 align-top dark:border-zinc-800"
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={`${section.id}-cell-${rowIndex}-${cellIndex}`}
                          className="px-3 py-2.5"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <p
            key={`${section.id}-p-${index}`}
            className="text-base leading-7 text-zinc-700 dark:text-zinc-300"
          >
            {block.text}
          </p>
        );
      })}
    </>
  );
}

export function LegalDocument({
  label,
  title,
  description,
  lastUpdated,
  sections,
  downloads,
}: LegalDocumentProps) {
  return (
    <div className="site-container pb-20 md:pb-28">
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
            <SectionBody section={section} />
          </section>
        ))}

        {downloads && downloads.length > 0 ? (
          <section className="space-y-4 border-t border-zinc-200 pt-10 dark:border-zinc-800">
            <h2 className="text-xl font-black tracking-[0.02em] text-zinc-950 md:text-2xl dark:text-white">
              Załączniki do pobrania
            </h2>
            <p className="text-base leading-7 text-zinc-700 dark:text-zinc-300">
              Poniższe pliki DOCX zawierają treść załączników do regulaminu —
              możesz je pobrać, wypełnić i odesłać.
            </p>
            <ul className="space-y-3">
              {downloads.map((file) => (
                <li key={file.href}>
                  <a
                    href={file.href}
                    download
                    className="group flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-4 transition-colors hover:border-[#0033ff]/40 hover:bg-[#0033ff]/5 dark:border-zinc-700 dark:bg-[#1c1c1c] dark:hover:border-[#daff02]/40 dark:hover:bg-[#daff02]/5"
                  >
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#0033ff]/10 text-[#0033ff] dark:bg-[#daff02]/15 dark:text-[#daff02]">
                      <DownloadIcon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-zinc-950 group-hover:text-[#0033ff] dark:text-white dark:group-hover:text-[#daff02]">
                        {file.label}
                      </span>
                      {file.description ? (
                        <span className="mt-1 block text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                          {file.description}
                        </span>
                      ) : null}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </div>
  );
}
