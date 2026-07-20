import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AuthPageSkeleton } from "@/components/auth/auth-page-layout";
import { authPageContent } from "@/components/auth/auth-page.utils";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { hasPasswordRecoveryPending } from "@/lib/auth/recovery";
import { PATHS } from "@/lib/paths";
import { NO_INDEX_ROBOTS } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Nowe hasło",
  description: "Ustaw nowe hasło do konta Z AI na Ty.",
  robots: NO_INDEX_ROBOTS,
};

type ResetPasswordPageProps = {
  searchParams: Promise<{
    info?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(PATHS.FORGOT_PASSWORD);
  }

  if (!(await hasPasswordRecoveryPending())) {
    redirect(PATHS.ACCOUNT);
  }

  return (
    <Suspense
      fallback={
        <AuthPageSkeleton
          title={authPageContent.resetPassword.title}
          description={authPageContent.resetPassword.description}
        />
      }
    >
      <ResetPasswordForm showRecoveryHint={params.info === "recovery"} />
    </Suspense>
  );
}
