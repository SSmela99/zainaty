import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthPageSkeleton } from "@/components/auth/auth-page-layout";
import { authPageContent } from "@/components/auth/auth-page.utils";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { redirectIfAuthenticated } from "@/lib/auth/session";
import { NO_INDEX_ROBOTS } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Przypomnij hasło",
  description: "Odzyskaj dostęp do konta Z AI na Ty.",
  robots: NO_INDEX_ROBOTS,
};

export default async function ForgotPasswordPage() {
  await redirectIfAuthenticated();

  return (
    <Suspense
      fallback={
        <AuthPageSkeleton
          title={authPageContent.forgotPassword.title}
          description={authPageContent.forgotPassword.description}
        />
      }
    >
      <ForgotPasswordForm />
    </Suspense>
  );
}
