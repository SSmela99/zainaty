"use client";

import { useEffect } from "react";

import { scrollAdminPanelToTop } from "./admin.utils";

export function useScrollAdminPanelWhen(active: boolean) {
  useEffect(() => {
    if (active) {
      scrollAdminPanelToTop();
    }
  }, [active]);
}
