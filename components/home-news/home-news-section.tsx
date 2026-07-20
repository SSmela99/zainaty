import { Reveal } from "@/components/reveal";
import { getHomeNewsItems } from "@/lib/news/queries";

import { HomeNewsSlider } from "./home-news-slider";

export async function HomeNewsSection() {
  const items = await getHomeNewsItems();

  return (
    <section className="bg-white py-16 md:py-20 dark:bg-[#151414]">
      <div className="mx-auto max-w-410 px-8">
        <Reveal>
          <div>
            <p className="text-[13px] font-bold tracking-[0.22em] text-[#0033ff] uppercase dark:text-[#6688ff]">
              Na bieżąco
            </p>
            <h2 className="mt-4 text-3xl leading-[1.1] font-black tracking-[-0.03em] text-zinc-950 md:text-5xl dark:text-white">
              Nowości
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 md:mt-12">
          <HomeNewsSlider items={items} />
        </div>
      </div>
    </section>
  );
}
