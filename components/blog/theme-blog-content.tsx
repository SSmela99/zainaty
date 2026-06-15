"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { BlogContent, type BlogContentVariant } from "@/components/blog/blog-content";

type ThemeBlogContentProps = {
  html: string;
  className?: string;
};

export function ThemeBlogContent({ html, className }: ThemeBlogContentProps) {
  const { resolvedTheme } = useTheme();
  const [variant, setVariant] = useState<BlogContentVariant>("light");

  useEffect(() => {
    setVariant(resolvedTheme === "dark" ? "dark" : "light");
  }, [resolvedTheme]);

  return <BlogContent html={html} variant={variant} className={className} />;
}
