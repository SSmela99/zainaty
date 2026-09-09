import type { CourseKind } from "@/lib/courses/kinds";
import type { CurriculumNode } from "@/lib/courses/curriculum";

export type CourseFileType = "pdf" | "video";

export type CourseFile = {
  id: string;
  course_id: string;
  file_type: CourseFileType;
  title: string;
  r2_object_key: string;
  sort_order: number;
  created_at: string;
};

export type CourseFileInput = {
  file_type: CourseFileType;
  title: string;
  r2_object_key: string;
};

export type CourseCurriculumInput = {
  kind: "section" | "lesson";
  title: string;
  description: string | null;
  r2_object_key: string | null;
  children: CourseCurriculumInput[];
};

export type CoursePackageItem = {
  id: string;
  title: string;
  slug: string;
  kind: CourseKind;
  cover_image_url: string | null;
};

export type Course = {
  id: string;
  kind: CourseKind;
  title: string;
  slug: string;
  description: string;
  description_secondary: string;
  demo_youtube_url: string | null;
  cover_image_url: string | null;
  price: number;
  discount_price: number | null;
  lowest_price_30_days: number | null;
  target_audience: string;
  learning_points: string[];
  outcomes: string[];
  duration_label: string;
  format_label: string;
  published: boolean;
  is_featured: boolean;
  show_in_news: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  files: CourseFile[];
  curriculum: CurriculumNode[];
  package_items: CoursePackageItem[];
};

export type CourseOption = {
  id: string;
  title: string;
  slug: string;
  kind: CourseKind;
  published: boolean;
};

export type PackageFormInput = {
  title: string;
  slug: string;
  cover_image_url: string | null;
  description: string;
  description_secondary: string;
  price: number;
  discount_price: number | null;
  published: boolean;
  course_ids: string[];
};

export type CourseFormInput = {
  kind: CourseKind;
  title: string;
  slug: string;
  description: string;
  demo_youtube_url: string | null;
  cover_image_url: string | null;
  price: number;
  discount_price: number | null;
  target_audience: string;
  learning_points: string[];
  outcomes: string[];
  duration_label: string;
  format_label: string;
  published: boolean;
  is_featured: boolean;
  show_in_news: boolean;
  files: CourseFileInput[];
  curriculum: CourseCurriculumInput[];
};

export type CourseActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

export function formatCoursePrice(value: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(value);
}

export function getCourseDiscountPercent(
  price: number,
  discountPrice: number | null,
): number | null {
  if (discountPrice == null || price <= 0 || discountPrice >= price) {
    return null;
  }

  return Math.round(((price - discountPrice) / price) * 100);
}
