import type { BlogPostRef, BlogPostWithRelations } from "@/lib/blog/types";

export function resolveRelatedPosts(
  currentPostId: string,
  relatedPosts: BlogPostRef[],
  allPosts: BlogPostWithRelations[],
  limit = 3,
): BlogPostWithRelations[] {
  return relatedPosts
    .map((entry) => allPosts.find((post) => post.id === entry.id))
    .filter(
      (post): post is BlogPostWithRelations =>
        post != null && post.id !== currentPostId,
    )
    .slice(0, limit);
}
