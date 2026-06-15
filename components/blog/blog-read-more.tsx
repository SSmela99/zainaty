import { BlogPostCard } from "@/components/blog/blog-post-card";
import { resolveRelatedPosts } from "@/lib/blog/related-posts";
import type { BlogPostRef, BlogPostWithRelations } from "@/lib/blog/types";

type BlogReadMoreProps = {
  currentPostId: string;
  relatedPosts: BlogPostRef[];
  allPosts: BlogPostWithRelations[];
};

export function BlogReadMore({
  currentPostId,
  relatedPosts,
  allPosts,
}: BlogReadMoreProps) {
  const posts = resolveRelatedPosts(currentPostId, relatedPosts, allPosts, 3);

  if (posts.length === 0) return null;

  return (
    <section className="mt-16 md:mt-20">
      <h2 className="text-2xl font-black tracking-[-0.02em] text-zinc-950 md:text-3xl dark:text-white">
        Czytaj dalej
      </h2>

      <ul className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <li key={post.id}>
            <BlogPostCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}
