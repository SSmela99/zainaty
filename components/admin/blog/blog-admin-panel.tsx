"use client";

import { useState } from "react";

import { adminSectionBodyClassName } from "@/components/admin/admin.utils";
import { AdminTabs } from "@/components/admin/admin-tabs";

import { BlogAuthorsManager } from "./blog-authors-manager";
import { BlogPostsManager } from "./blog-posts-manager";
import { BlogTagsManager } from "./blog-tags-manager";

type BlogTab = "posts" | "tags" | "authors";

const BLOG_TABS = [
  { id: "posts" as const, label: "Artykuły" },
  { id: "tags" as const, label: "Tagi" },
  { id: "authors" as const, label: "Autorzy" },
];

export function BlogAdminPanel() {
  const [tab, setTab] = useState<BlogTab>("posts");

  return (
    <div className={adminSectionBodyClassName}>
      <AdminTabs
        tabs={BLOG_TABS}
        activeTab={tab}
        onTabChange={setTab}
        ariaLabel="Zakładki bloga"
      />

      {tab === "posts" ? <BlogPostsManager /> : null}
      {tab === "tags" ? <BlogTagsManager /> : null}
      {tab === "authors" ? <BlogAuthorsManager /> : null}
    </div>
  );
}
