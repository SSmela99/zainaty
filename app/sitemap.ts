import type { MetadataRoute } from "next";

import { getPublishedBlogSlugs } from "@/lib/blog/queries";
import { getPublishedCourseSlugs } from "@/lib/courses/queries";
import { PATHS, blogPath, coursePath } from "@/lib/paths";
import { getSiteUrl } from "@/lib/stripe/config";

const STATIC_PAGES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: PATHS.HOME, changeFrequency: "weekly", priority: 1 },
  { path: PATHS.OFFER, changeFrequency: "monthly", priority: 0.9 },
  { path: PATHS.COURSES_TRAININGS, changeFrequency: "weekly", priority: 0.9 },
  { path: PATHS.COURSES_VIDEO, changeFrequency: "weekly", priority: 0.9 },
  { path: PATHS.COURSES_PACKAGES, changeFrequency: "weekly", priority: 0.85 },
  { path: PATHS.BLOG, changeFrequency: "weekly", priority: 0.85 },
  { path: PATHS.FREE_MATERIALS, changeFrequency: "weekly", priority: 0.85 },
  { path: PATHS.ABOUT, changeFrequency: "monthly", priority: 0.7 },
  { path: PATHS.FAQ, changeFrequency: "monthly", priority: 0.7 },
  { path: PATHS.CONSULTATION, changeFrequency: "monthly", priority: 0.8 },
  { path: PATHS.PRIVACY, changeFrequency: "yearly", priority: 0.3 },
  { path: PATHS.TERMS, changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const [blogSlugs, courseSlugs] = await Promise.all([
    getPublishedBlogSlugs(),
    getPublishedCourseSlugs(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${siteUrl}${page.path === "/" ? "" : page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((post) => ({
    url: `${siteUrl}${blogPath(post.slug)}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const courseEntries: MetadataRoute.Sitemap = courseSlugs.map((course) => ({
    url: `${siteUrl}${coursePath(course.slug)}`,
    lastModified: new Date(course.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...blogEntries, ...courseEntries];
}
