"use client";

import { useState } from "react";

import { AdminTabs } from "@/components/admin/admin-tabs";
import {
  adminSectionBodyClassName,
} from "@/components/admin/admin.utils";
import {
  COURSE_KIND_LABELS,
  COURSE_KINDS,
  type CourseKind,
} from "@/lib/courses/kinds";

import { CoursesManager } from "./courses-manager";

const COURSE_TABS = COURSE_KINDS.map((kind) => ({
  id: kind,
  label: COURSE_KIND_LABELS[kind],
}));

export function CoursesAdminPanel() {
  const [activeKind, setActiveKind] = useState<CourseKind>("training");

  return (
    <div className={adminSectionBodyClassName}>
      <AdminTabs
        tabs={COURSE_TABS}
        activeTab={activeKind}
        onTabChange={setActiveKind}
        ariaLabel="Rodzaje kursów"
      />

      <CoursesManager key={activeKind} kind={activeKind} />
    </div>
  );
}
