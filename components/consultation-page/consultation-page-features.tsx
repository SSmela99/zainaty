import { consultationFeatures } from "./consultation-page.utils";

export function ConsultationPageFeatures() {
  return (
    <section className="px-8 pb-12 md:pb-16">
      <div className="mx-auto grid max-w-350 gap-4 md:grid-cols-3 md:gap-5">
        {consultationFeatures.map(({ id, Icon, title, description, palette }) => (
          <article
            key={id}
            className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] md:p-7 dark:bg-[#1c1c1c] dark:shadow-[0_8px_32px_rgba(0,0,0,0.28)]"
          >
            <div
              className={`flex size-12 items-center justify-center rounded-2xl ${palette.box}`}
            >
              <Icon className={`size-5 ${palette.icon}`} strokeWidth={2.2} />
            </div>
            <h2 className="mt-5 text-lg font-black tracking-[0.02em] text-zinc-950 dark:text-white">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
