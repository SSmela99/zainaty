import { unstable_cache } from "next/cache";

import { createPublicClient } from "@/lib/supabase/public";
import type { CourseKind } from "@/lib/courses/kinds";
import { PATHS, coursePath } from "@/lib/paths";

import type {
  NewsArticleSource,
  NewsCourseSource,
  NewsFreeMaterialSource,
  NewsItem,
} from "./types";

const CONSULTATION_NEWS_ITEM: NewsItem = {
  id: "hardcoded-consultation",
  kind: "consultation",
  title: "Umów się na bezpłatną konsultację AI — 15 minut online",
  href: PATHS.CONSULTATION,
  cover_image_url:
    "https://picsum.photos/seed/zainaty-news-consultation/800/600",
  badgeLabel: "Konsultacja",
  badgeTone: "red",
  ctaLabel: "Zapisz się",
  created_at: "9999-12-31T00:00:00.000Z",
};

function toNumber(value: unknown): number {
  return typeof value === "number" ? value : Number(value);
}

function mapArticleToNews(article: NewsArticleSource): NewsItem {
  return {
    id: `article-${article.id}`,
    kind: "article",
    title: article.title,
    href: `${PATHS.BLOG}/${article.slug}`,
    cover_image_url: article.cover_image_url,
    badgeLabel: "Artykuł",
    badgeTone: "purple",
    ctaLabel: "Czytaj dalej",
    created_at: article.created_at,
  };
}

function mapCourseToNews(course: NewsCourseSource): NewsItem {
  const isFree = course.price <= 0;
  const hasDemo = Boolean(course.demo_youtube_url);

  let badgeLabel = "Szkolenie";
  let badgeTone: NewsItem["badgeTone"] = "orange";
  let ctaLabel = "Sprawdź kurs";

  if (course.kind === "video") {
    badgeLabel = hasDemo ? "Demo kursu" : "Kurs wideo";
    badgeTone = "blue";
    ctaLabel = hasDemo ? "Sprawdź demo" : "Sprawdź kurs";
  } else if (course.kind === "package") {
    badgeLabel = "Pakiet";
    badgeTone = "orange";
    ctaLabel = "Zobacz pakiet";
  } else if (isFree) {
    badgeLabel = "Darmowy kurs";
    badgeTone = "orange";
    ctaLabel = "Pobierz za darmo";
  } else if (hasDemo) {
    badgeLabel = "Demo kursu";
    badgeTone = "blue";
    ctaLabel = "Sprawdź demo";
  }

  return {
    id: `course-${course.id}`,
    kind: "course",
    title: course.title,
    href: coursePath(course.slug),
    cover_image_url: course.cover_image_url,
    badgeLabel,
    badgeTone,
    ctaLabel,
    created_at: course.created_at,
  };
}

function mapFreeMaterialToNews(material: NewsFreeMaterialSource): NewsItem {
  const slug = material.tag_slug;
  let badgeLabel = material.tag_name ?? "Materiał";
  let badgeTone: NewsItem["badgeTone"] = "orange";

  if (material.is_video || slug === "wideo") {
    badgeLabel = "Wideo";
    badgeTone = "blue";
  } else if (slug === "e-booki") {
    badgeLabel = "Nowy E-book";
    badgeTone = "orange";
  } else if (slug === "checklisty") {
    badgeLabel = "Checklista";
    badgeTone = "blue";
  } else if (slug === "templateki") {
    badgeLabel = "Szablon";
    badgeTone = "red";
  } else if (slug === "kolorowanki") {
    badgeLabel = "Kolorowanka";
    badgeTone = "purple";
  }

  return {
    id: `free-material-${material.id}`,
    kind: "free_material",
    title: material.title,
    href: PATHS.FREE_MATERIALS,
    cover_image_url: material.cover_image_url,
    badgeLabel,
    badgeTone,
    ctaLabel: material.is_video ? "Obejrzyj wideo" : "Pobierz za darmo",
    created_at: material.created_at,
  };
}

async function getNewsArticles(): Promise<NewsArticleSource[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, cover_image_url, created_at")
    .eq("published", true)
    .eq("show_in_news", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[news] getNewsArticles", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    cover_image_url: (row.cover_image_url as string | null) ?? null,
    created_at: row.created_at as string,
  }));
}

async function getNewsCourses(): Promise<NewsCourseSource[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, kind, title, slug, cover_image_url, price, demo_youtube_url, created_at",
    )
    .eq("published", true)
    .eq("show_in_news", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[news] getNewsCourses", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id as string,
    kind: (row.kind as CourseKind | undefined) ?? "training",
    title: row.title as string,
    slug: row.slug as string,
    cover_image_url: (row.cover_image_url as string | null) ?? null,
    price: toNumber(row.price),
    demo_youtube_url: (row.demo_youtube_url as string | null) ?? null,
    created_at: row.created_at as string,
  }));
}

async function getNewsFreeMaterials(): Promise<NewsFreeMaterialSource[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("free_materials")
    .select(
      "id, title, cover_image_url, is_video, created_at, tag:free_material_tags(slug, name)",
    )
    .eq("published", true)
    .eq("show_in_news", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[news] getNewsFreeMaterials", error);
    return [];
  }

  return (data ?? []).map((row) => {
    const tag = row.tag as { slug?: string; name?: string } | null;
    return {
      id: row.id as string,
      title: row.title as string,
      cover_image_url: (row.cover_image_url as string | null) ?? null,
      is_video: Boolean(row.is_video),
      tag_slug: tag?.slug ?? null,
      tag_name: tag?.name ?? null,
      created_at: row.created_at as string,
    };
  });
}

/** Konsultacja zawsze pierwsza, potem reszta wg daty. */
async function fetchHomeNewsItems(): Promise<NewsItem[]> {
  const [articles, courses, freeMaterials] = await Promise.all([
    getNewsArticles(),
    getNewsCourses(),
    getNewsFreeMaterials(),
  ]);

  const dynamicItems = [
    ...articles.map(mapArticleToNews),
    ...courses.map(mapCourseToNews),
    ...freeMaterials.map(mapFreeMaterialToNews),
  ].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  return [CONSULTATION_NEWS_ITEM, ...dynamicItems];
}

export const getHomeNewsItems = unstable_cache(
  fetchHomeNewsItems,
  ["home-news-items"],
  { revalidate: 60, tags: ["home-news"] },
);
