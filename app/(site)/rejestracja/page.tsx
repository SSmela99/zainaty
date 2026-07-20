import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthPageSkeleton } from "@/components/auth/auth-page-layout";
import { authPageContent } from "@/components/auth/auth-page.utils";
import { RegisterForm } from "@/components/auth/register-form";
import { redirectIfAuthenticated } from "@/lib/auth/session";
import { NO_INDEX_ROBOTS } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Załóż konto",
  description: "Utwórz konto w Z AI na Ty i zacznij naukę z pomocą hasła.",
  robots: NO_INDEX_ROBOTS,
};

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return (
    <Suspense
      fallback={
        <AuthPageSkeleton
          title={authPageContent.register.title}
          description={authPageContent.register.description}
        />
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
