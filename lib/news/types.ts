import type { CourseKind } from "@/lib/courses/kinds";

export type NewsItemKind = "consultation" | "article" | "course" | "free_material";

export type NewsItem = {
  id: string;
  kind: NewsItemKind;
  title: string;
  href: string;
  cover_image_url: string | null;
  badgeLabel: string;
  badgeTone: "orange" | "blue" | "purple" | "red";
  ctaLabel: string;
  created_at: string;
};

export type NewsCourseSource = {
  id: string;
  kind: CourseKind;
  title: string;
  slug: string;
  cover_image_url: string | null;
  price: number;
  demo_youtube_url: string | null;
  created_at: string;
};

export type NewsArticleSource = {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
  created_at: string;
};

export type NewsFreeMaterialSource = {
  id: string;
  title: string;
  cover_image_url: string | null;
  is_video: boolean;
  tag_slug: string | null;
  tag_name: string | null;
  created_at: string;
};
