import type { Metadata } from "next";

import { getSiteUrl } from "@/lib/stripe/config";

export const SITE = {
  name: "Z AI na Ty",
  tagline: "Technologia po ludzku",
  description:
    "Uczymy AI i nowych narzędzi bez stresu i technobełkotu. Kursy, darmowe materiały i konsultacje — krok po kroku, dla każdego.",
  locale: "pl_PL",
  language: "pl",
  email: "kontakt@zainaty.pl",
  twitterHandle: undefined as string | undefined,
} as const;

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const NO_INDEX_ROBOTS = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
} satisfies NonNullable<Metadata["robots"]>;

type BuildPageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
  /** Pomija szablon „| Z AI na Ty” (np. home). */
  absoluteTitle?: boolean;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authors?: string[];
  tags?: string[];
};

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  noIndex = false,
  absoluteTitle = false,
  publishedTime,
  modifiedTime,
  authors,
  tags,
}: BuildPageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image?.trim() || undefined;
  const images = ogImage
    ? [{ url: ogImage, alt: title }]
    : undefined;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    robots: noIndex ? NO_INDEX_ROBOTS : { index: true, follow: true },
    openGraph: {
      type,
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title,
      description,
      ...(images ? { images } : {}),
      ...(type === "article"
        ? {
            publishedTime: publishedTime ?? undefined,
            modifiedTime: modifiedTime ?? undefined,
            authors: authors?.length ? authors : undefined,
            tags: tags?.length ? tags : undefined,
          }
        : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      ...(images ? { images: [ogImage!] } : {}),
    },
  };
}

export function truncateDescription(text: string, max = 160): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).trimEnd()}…`;
}
