import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthPageSkeleton } from "@/components/auth/auth-page-layout";
import { LoginForm } from "@/components/auth/login-form";
import { authPageContent } from "@/components/auth/auth-page.utils";
import { redirectIfAuthenticated } from "@/lib/auth/session";
import { NO_INDEX_ROBOTS } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  title: "Zaloguj się",
  description: "Zaloguj się do Z AI na Ty za pomocą e-maila i hasła.",
  robots: NO_INDEX_ROBOTS,
};

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <Suspense
      fallback={
        <AuthPageSkeleton
          title={authPageContent.login.title}
          description={authPageContent.login.description}
        />
      }
    >
      <LoginForm />
    </Suspense>
  );
}
