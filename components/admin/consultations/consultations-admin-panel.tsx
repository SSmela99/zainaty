"use client";

import { useState } from "react";

import { AdminTabs, type AdminTabItem } from "@/components/admin/admin-tabs";
import { adminSectionBodyClassName } from "@/components/admin/admin.utils";

import { ConsultationBookingsList } from "./consultation-bookings-list";
import { ConsultationExclusionsManager } from "./consultation-exclusions-manager";

type ConsultationTab = "bookings" | "exclusions";

const CONSULTATION_TABS = [
  { id: "bookings", label: "Zarezerwowane" },
  { id: "exclusions", label: "Wyklucz daty" },
] as const satisfies readonly AdminTabItem<ConsultationTab>[];

export function ConsultationsAdminPanel() {
  const [tab, setTab] = useState<ConsultationTab>("bookings");

  return (
    <div className={adminSectionBodyClassName}>
      <AdminTabs
        tabs={CONSULTATION_TABS}
        activeTab={tab}
        onTabChange={setTab}
        ariaLabel="Zakładki konsultacji"
      />

      {tab === "bookings" ? (
        <ConsultationBookingsList />
      ) : (
        <ConsultationExclusionsManager />
      )}
    </div>
  );
}
