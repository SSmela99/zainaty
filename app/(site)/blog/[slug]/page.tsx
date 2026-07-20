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
import { JsonLd } from "@/components/seo/json-ld";
import { sortTagsByName } from "@/lib/blog/format";
import {
  getBlogPostBySlug,
  getBlogPostsByIds,
  getPublishedBlogSlugs,
} from "@/lib/blog/queries";
import { pickRelatedPosts } from "@/lib/blog/related-posts";
import { PATHS, blogPath } from "@/lib/paths";
import { blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata, truncateDescription } from "@/lib/seo/metadata";

type BlogArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getPublishedBlogSlugs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Artykuł nie znaleziony" };
  }

  const authorName = post.author
    ? `${post.author.first_name} ${post.author.last_name}`.trim()
    : undefined;

  return buildPageMetadata({
    title: post.title,
    description: truncateDescription(post.excerpt || post.title),
    path: blogPath(post.slug),
    image: post.cover_image_url,
    type: "article",
    publishedTime: post.published_at ?? post.created_at,
    modifiedTime: post.updated_at,
    authors: authorName ? [authorName] : undefined,
    tags: post.tags.map((tag) => tag.name),
  });
}

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  const relatedLoaded = await getBlogPostsByIds(
    post.related_posts.map((entry) => entry.id),
  );
  const relatedPosts = pickRelatedPosts(
    post.related_posts.map((entry) => entry.id),
    relatedLoaded,
    post.id,
    3,
  );

  const tags = sortTagsByName(post.tags);
  const hasCover = Boolean(post.cover_image_url);

  return (
    <article className="pb-20 md:pb-28">
      <JsonLd
        data={[
          blogPostingJsonLd(post),
          breadcrumbJsonLd([
            { name: "Home", path: PATHS.HOME },
            { name: "Blog", path: PATHS.BLOG },
            { name: post.title, path: blogPath(post.slug) },
          ]),
        ]}
      />

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
              className="mt-8 inline-block text-sm font-bold text-[#f24a00] transition-colors hover:text-[#0033ff] dark:text-[#daff02] dark:hover:text-[#6688ff]"
            >
              ← Wróć do wszystkich artykułów
            </Link>
          </div>

          <div>
            <BlogArticleSidebarColumn
              author={post.author}
              relatedPosts={relatedPosts}
            />
          </div>
        </div>

        <BlogReadMore posts={relatedPosts} />
      </div>
    </article>
  );
}
