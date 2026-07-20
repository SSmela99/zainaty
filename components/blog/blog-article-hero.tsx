import Image from "next/image";

import { BlogImageChip, BlogImageChips } from "@/components/blog/blog-image-chip";
import type { Tag } from "@/lib/blog/types";

type BlogArticleHeroProps = {
  coverImageUrl: string;
  title: string;
  tags: Tag[];
};

export function BlogArticleHero({ coverImageUrl, title, tags }: BlogArticleHeroProps) {
  const primaryTag = tags[0];

  return (
    <div className="relative -mt-18 w-full">
      <div className="relative aspect-[21/9] min-h-[320px] w-full bg-[#f5f2e9] md:min-h-[480px] dark:bg-[#242424]">
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          className="object-cover"
          unoptimized
          priority
        />

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25"
        />

        <div className="absolute inset-x-0 bottom-0 z-10">
          <div className="mx-auto max-w-350 px-8 pb-10 pt-28 md:pb-14 md:pt-32">
            {primaryTag ? (
              <BlogImageChips className="static max-w-none">
                <BlogImageChip>{primaryTag.name}</BlogImageChip>
              </BlogImageChips>
            ) : null}

            <h1
              className={`max-w-4xl text-3xl leading-tight font-black tracking-[-0.03em] text-white md:text-5xl lg:text-[3.25rem] ${primaryTag ? "mt-4" : ""}`}
            >
              {title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
