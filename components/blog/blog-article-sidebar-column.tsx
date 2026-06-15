import { BlogAuthorSidebar } from "@/components/blog/blog-author-sidebar";
import {
  BlogConsultationCta,
  BlogRelatedSidebar,
} from "@/components/blog/blog-article-sidebar";
import { resolveRelatedPosts } from "@/lib/blog/related-posts";
import type { Author, BlogPostRef, BlogPostWithRelations } from "@/lib/blog/types";

type BlogArticleSidebarColumnProps = {
  author: Author | null;
  currentPostId: string;
  relatedPosts: BlogPostRef[];
  allPosts: BlogPostWithRelations[];
};

export function BlogArticleSidebarColumn({
  author,
  currentPostId,
  relatedPosts,
  allPosts,
}: BlogArticleSidebarColumnProps) {
  const sidebarRelated = resolveRelatedPosts(currentPostId, relatedPosts, allPosts, 3);

  return (
    <div className="flex flex-col gap-6">
      {author ? (
        <div className="relative z-20 lg:sticky lg:top-24">
          <BlogAuthorSidebar author={author} />
        </div>
      ) : null}
      <div className="relative z-0 flex flex-col gap-6">
        <BlogRelatedSidebar posts={sidebarRelated} />
        <BlogConsultationCta />
      </div>
    </div>
  );
}
