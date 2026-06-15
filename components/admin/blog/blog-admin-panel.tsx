"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { BlogAuthorsManager } from "./blog-authors-manager";
import { BlogPostsManager } from "./blog-posts-manager";
import { BlogTagsManager } from "./blog-tags-manager";

type BlogTab = "posts" | "tags" | "authors";

const tabs: { id: BlogTab; label: string }[] = [
  { id: "posts", label: "Artykuły" },
  { id: "tags", label: "Tagi" },
  { id: "authors", label: "Autorzy" },
];

export function BlogAdminPanel() {
  const [tab, setTab] = useState<BlogTab>("posts");

  return (
    <div className="mt-10">
      <div className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "cursor-pointer rounded-full px-4 py-2 text-sm font-bold transition-colors",
              tab === item.id
                ? "bg-[#ff4b12] text-white dark:bg-[#d7ff00] dark:text-black"
                : "bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-[#1c1c1c] dark:text-zinc-300 dark:hover:bg-zinc-800",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "posts" ? <BlogPostsManager /> : null}
        {tab === "tags" ? <BlogTagsManager /> : null}
        {tab === "authors" ? <BlogAuthorsManager /> : null}
      </div>
    </div>
  );
}
