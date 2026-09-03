export const NEWSLETTER_SOURCE = {
  SECTION: "section",
  DIALOG: "dialog",
  BLOG_ARTICLE: "blog-article",
  FREE_MATERIALS: "free-materials",
} as const;

export type NewsletterSource =
  (typeof NEWSLETTER_SOURCE)[keyof typeof NEWSLETTER_SOURCE];
