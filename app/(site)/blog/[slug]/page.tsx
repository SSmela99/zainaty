import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  BlogArticleHero,
  BlogArticleMetaBar,
  BlogArticleNewsletter,
  BlogArticleSidebarColumn,
  BlogImageChip,
  BlogReadMore,
  ThemeBlogContent,
} from "@/components/blog";
import { sortTagsByName } from "@/lib/blog/format";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/blog/queries";
import { PATHS } from "@/lib/paths";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Artykuł nie znaleziony" };
  }

  return {
    title: post.title,
    description: post.excerpt || undefined,
  };
}

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getPublishedBlogPosts(),
  ]);

  if (!post) notFound();

  const tags = sortTagsByName(post.tags);
  const hasCover = Boolean(post.cover_image_url);

  return (
    <article className="pb-20 md:pb-28">
      {hasCover ? (
        <BlogArticleHero
          coverImageUrl={post.cover_image_url!}
          title={post.title}
          tags={tags}
        />
      ) : null}

      <div className="mx-auto max-w-350 px-8 pt-10 md:pt-14">
        {!hasCover ? (
          <header>
            {tags.length > 0 ? (
              <div className="mb-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <BlogImageChip key={tag.id}>{tag.name}</BlogImageChip>
                ))}
              </div>
            ) : null}

            <h1 className="text-3xl leading-tight font-black tracking-[-0.03em] text-zinc-950 md:text-5xl dark:text-white">
              {post.title}
            </h1>
          </header>
        ) : null}

        <div>
          <BlogArticleMetaBar
            author={post.author}
            publishedAt={post.published_at}
            readingTimeMinutes={post.reading_time_minutes}
            tags={tags}
          />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <ThemeBlogContent html={post.content_html} />

            <BlogArticleNewsletter />

            <Link
              href={PATHS.BLOG}
              className="mt-8 inline-block text-sm font-bold text-[#ff4b12] transition-colors hover:text-[#1a4dff] dark:text-[#d7ff00] dark:hover:text-[#7d9bff]"
            >
              ← Wróć do wszystkich artykułów
            </Link>
          </div>

          <div>
            <BlogArticleSidebarColumn
              author={post.author}
              currentPostId={post.id}
              relatedPosts={post.related_posts}
              allPosts={allPosts}
            />
          </div>
        </div>

        <BlogReadMore
          currentPostId={post.id}
          relatedPosts={post.related_posts}
          allPosts={allPosts}
        />
      </div>
    </article>
  );
}
