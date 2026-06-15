import { cn } from "@/lib/utils";

import "./blog-content.css";

export type BlogContentVariant = "light" | "dark";

type BlogContentProps = {
  html: string;
  className?: string;
  variant?: BlogContentVariant;
};

export function BlogContent({
  html,
  className,
  variant = "dark",
}: BlogContentProps) {
  return (
    <div
      className={cn(
        "blog-content",
        variant === "light" ? "blog-content--light" : "blog-content--dark",
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
