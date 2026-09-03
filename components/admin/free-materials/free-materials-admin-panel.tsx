"use client";

import { useState } from "react";

import { adminSectionBodyClassName } from "@/components/admin/admin.utils";
import { AdminTabs } from "@/components/admin/admin-tabs";

import { FreeMaterialLinksManager } from "./free-material-links-manager";
import { FreeMaterialTagsManager } from "./free-material-tags-manager";
import { FreeMaterialsManager } from "./free-materials-manager";

type FreeMaterialsTab = "materials" | "links" | "tags";

const FREE_MATERIALS_TABS = [
  { id: "materials" as const, label: "Materiały" },
  { id: "links" as const, label: "Linki" },
  { id: "tags" as const, label: "Tagi" },
];

export function FreeMaterialsAdminPanel() {
  const [tab, setTab] = useState<FreeMaterialsTab>("materials");

  return (
    <div className={adminSectionBodyClassName}>
      <AdminTabs
        tabs={FREE_MATERIALS_TABS}
        activeTab={tab}
        onTabChange={setTab}
        ariaLabel="Zakładki darmowych materiałów"
      />

      {tab === "materials" ? <FreeMaterialsManager /> : null}
      {tab === "links" ? <FreeMaterialLinksManager /> : null}
      {tab === "tags" ? <FreeMaterialTagsManager /> : null}
    </div>
  );
}
