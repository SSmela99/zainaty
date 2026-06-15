import type { Metadata } from "next";

import { BlogFeaturedCard, BlogHero, BlogListing } from "@/components/blog";
import {
  getBlogFilterTags,
  getFeaturedBlogPost,
  getPublishedBlogPosts,
} from "@/lib/blog/queries";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artykuły o AI, technologii i produktywności — napisane po ludzku, bez skrótów i bez presji.",
};

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
          <div className="mb-10 md:mb-14">
            <BlogFeaturedCard post={featuredPost} />
          </div>
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
