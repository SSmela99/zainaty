"use client";

import { Suspense } from "react";

import { AuthRedirectToast } from "@/components/auth";
import { PurchaseSuccessToast } from "@/components/checkout";
import { CustomCursor } from "@/components/custom-cursor";
import { NavigationProgress } from "@/components/navigation-progress";
import { NewsletterDialog } from "@/components/newsletter";
import { Toaster } from "@/components/ui/sonner";

export function SiteShellClient() {
  return (
    <>
      <NavigationProgress />
      <CustomCursor />
      <NewsletterDialog />
      <Suspense fallback={null}>
        <AuthRedirectToast />
        <PurchaseSuccessToast />
      </Suspense>
      <Toaster />
    </>
  );
}
