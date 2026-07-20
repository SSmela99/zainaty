import type { Metadata } from "next";

import { BlogFeaturedCard, BlogHero, BlogListing } from "@/components/blog";
import { Reveal } from "@/components/reveal";
import {
  getBlogFilterTags,
  getFeaturedBlogPost,
  getPublishedBlogPosts,
} from "@/lib/blog/queries";
import { PATHS } from "@/lib/paths";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog",
  description:
    "Artykuły o AI, technologii i produktywności — napisane po ludzku, bez skrótów i bez presji.",
  path: PATHS.BLOG,
});

type BlogPageProps = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { tag } = await searchParams;
  const activeTagSlug = tag?.trim() || null;

  const [featuredPost, posts, tags] = await Promise.all([
    getFeaturedBlogPost(),
    getPublishedBlogPosts(activeTagSlug),
    getBlogFilterTags(),
  ]);

  return (
    <>
      <div className="mx-auto max-w-350 px-8 pb-20 md:pb-28">
        <BlogHero />

        {featuredPost ? (
          <Reveal className="mb-10 md:mb-14">
            <BlogFeaturedCard post={featuredPost} />
          </Reveal>
        ) : null}

        <BlogListing
          posts={posts}
          tags={tags}
          activeTagSlug={activeTagSlug}
          featuredPostId={featuredPost?.id ?? null}
        />
      </div>
    </>
  );
}
