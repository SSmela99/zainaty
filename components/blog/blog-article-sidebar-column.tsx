import { BlogAuthorSidebar } from "@/components/blog/blog-author-sidebar";
import {
  BlogConsultationCta,
  BlogRelatedSidebar,
} from "@/components/blog/blog-article-sidebar";
import type { Author, BlogPostWithRelations } from "@/lib/blog/types";

type BlogArticleSidebarColumnProps = {
  author: Author | null;
  relatedPosts: BlogPostWithRelations[];
};

export function BlogArticleSidebarColumn({
  author,
  relatedPosts,
}: BlogArticleSidebarColumnProps) {
  return (
    <div className="flex flex-col gap-6">
      {author ? (
        <div className="relative z-20 lg:sticky lg:top-24">
          <BlogAuthorSidebar author={author} />
        </div>
      ) : null}
      <div className="relative z-0 flex flex-col gap-6">
        <BlogRelatedSidebar posts={relatedPosts} />
        <BlogConsultationCta />
      </div>
    </div>
  );
}
