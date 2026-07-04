import type { Metadata } from "next";
import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { redirectIfAuthenticated } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Zaloguj się",
  description: "Zaloguj się do Z AI na Ty za pomocą magic linka wysłanego na e-mail.",
};

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
