import type { Metadata } from "next";
import { Suspense } from "react";

import { RegisterForm } from "@/components/auth/register-form";
import { redirectIfAuthenticated } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Załóż konto",
  description: "Utwórz konto w Z AI na Ty i zacznij naukę z pomocą magic linka.",
};

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
