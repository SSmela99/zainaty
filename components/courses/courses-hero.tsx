import { HeroReveal } from "@/components/hero/hero-reveal";

type CoursesHeroProps = {
  title?: string;
  description?: string;
};

export function CoursesHero({
  title = "Pojedyncze kursy",
  description = "Szukasz czegoś konkretnego? Wybierz pojedynczy kurs i ucz się we własnym tempie.",
}: CoursesHeroProps) {
  return (
    <section className="pt-16 pb-10 text-center md:pt-20 md:pb-14">
      <HeroReveal>
        <h1 className="text-3xl leading-[1.1] font-black tracking-[-0.03em] text-zinc-950 md:text-5xl dark:text-white">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </HeroReveal>
    </section>
  );
}
