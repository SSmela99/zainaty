import type { BlogPostWithRelations } from "@/lib/blog/types";
import type { Course } from "@/lib/courses/types";
import type { FaqItem } from "@/lib/faq/types";
import { PATHS, blogPath, coursePath } from "@/lib/paths";
import { absoluteUrl, SITE } from "@/lib/seo/metadata";

type JsonLd = Record<string, unknown>;

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: absoluteUrl("/"),
    email: SITE.email,
    description: SITE.description,
    logo: absoluteUrl("/zainaty.svg"),
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: absoluteUrl("/"),
    description: SITE.description,
    inLanguage: SITE.language,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: absoluteUrl("/"),
    },
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageJsonLd(items: FaqItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function blogPostingJsonLd(post: BlogPostWithRelations): JsonLd {
  const authorName = post.author
    ? `${post.author.first_name} ${post.author.last_name}`.trim()
    : SITE.name;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: absoluteUrl("/"),
    },
    mainEntityOfPage: absoluteUrl(blogPath(post.slug)),
    keywords: post.tags.map((tag) => tag.name).join(", "),
    inLanguage: SITE.language,
    wordCount: undefined,
    timeRequired: `PT${Math.max(1, post.reading_time_minutes)}M`,
  };
}

export function courseJsonLd(course: Course): JsonLd {
  const price = course.discount_price ?? course.price;

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: SITE.name,
      url: absoluteUrl("/"),
    },
    url: absoluteUrl(coursePath(course.slug)),
    image: course.cover_image_url ?? undefined,
    inLanguage: SITE.language,
    offers: {
      "@type": "Offer",
      price: price,
      priceCurrency: "PLN",
      availability: "https://schema.org/InStock",
      url: absoluteUrl(coursePath(course.slug)),
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: course.kind === "video" ? "online" : "blended",
      courseWorkload: course.duration_label,
    },
  };
}

export function serviceConsultationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bezpłatna konsultacja AI",
    description:
      "30-minutowa konsultacja online o AI i narzędziach — bez zobowiązań.",
    provider: {
      "@type": "Organization",
      name: SITE.name,
      url: absoluteUrl("/"),
    },
    areaServed: "PL",
    url: absoluteUrl(PATHS.CONSULTATION),
  };
}
