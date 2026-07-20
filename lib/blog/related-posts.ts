import type { BlogPostWithRelations } from "@/lib/blog/types";

/** Zachowuje kolejność `orderedIds`, pomija bieżący post i nieopublikowane. */
export function pickRelatedPosts(
  orderedIds: string[],
  posts: BlogPostWithRelations[],
  currentPostId: string,
  limit = 3,
): BlogPostWithRelations[] {
  const byId = new Map(posts.map((post) => [post.id, post]));

  return orderedIds
    .map((id) => byId.get(id))
    .filter(
      (post): post is BlogPostWithRelations =>
        post != null && post.id !== currentPostId,
    )
    .slice(0, limit);
}
