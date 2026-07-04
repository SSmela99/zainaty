import Link from "next/link";

import { getHomeBlogSectionData } from "@/lib/blog/queries";
import { PATHS } from "@/lib/paths";

import { HomeBlogFeaturedCard } from "./home-blog-featured-card";
import { HomeBlogGrid } from "./home-blog-grid";
import { HomeBlogLatestCard } from "./home-blog-latest-card";

export async function HomeBlogSection() {
  const { featured, latest } = await getHomeBlogSectionData();

  if (!featured && latest.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f2efe6] py-16 md:py-20 dark:bg-[#111111]">
      <div className="mx-auto w-full max-w-328 px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[13px] font-bold tracking-[0.22em] text-[#1a4dff] uppercase">
              Blog
            </p>
            <h2 className="mt-4 text-3xl leading-[1.1] font-black tracking-[-0.03em] text-zinc-950 md:text-5xl dark:text-white">
              Wiedza{" "}
              <span className="text-[#ff4b12] dark:text-[#d7ff00]">
                po ludzku
              </span>
            </h2>
          </div>

          <Link
            href={PATHS.BLOG}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#ff4b12] transition-colors hover:text-[#1a4dff] dark:text-[#d7ff00] dark:hover:text-[#7d9bff]"
          >
            Wszystkie artykuły
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-12">
          <HomeBlogGrid
            hasLatest={latest.length > 0}
            featured={
              featured ? <HomeBlogFeaturedCard post={featured} /> : null
            }
            latest={
              <>
                {latest.map((post) => (
                  <HomeBlogLatestCard key={post.id} post={post} />
                ))}
              </>
            }
          />
        </div>
      </div>
    </section>
  );
}
