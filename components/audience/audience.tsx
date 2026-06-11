import { audienceCards } from "./audience.utils";

export function Audience() {
  return (
    <section className="bg-[#ebe3d4] py-16 dark:bg-[#0a0a0a] md:py-24">
      <div className="mx-auto max-w-410 px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {audienceCards.map(({ id, Icon, palette, title, description }) => (
            <article
              key={id}
              className="group rounded-2xl bg-[#fbf6ec] p-7 shadow-sm ring-2 ring-transparent transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:ring-[#ff4b12] dark:bg-[#1c1c1c] dark:shadow-none dark:hover:shadow-[0_18px_40px_rgba(0,0,0,0.5)] dark:hover:ring-[#d7ff00]"
            >
              <div
                className={`flex size-12 items-center justify-center rounded-xl transition-colors duration-300 ease-out ${palette.box} ${palette.boxHover}`}
              >
                <Icon
                  strokeWidth={2.2}
                  className={`size-5 transition-colors duration-300 ease-out ${palette.icon} ${palette.iconHover}`}
                />
              </div>
              <h3 className="mt-7 text-lg leading-snug font-black tracking-[-0.02em] text-zinc-950 dark:text-white">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
