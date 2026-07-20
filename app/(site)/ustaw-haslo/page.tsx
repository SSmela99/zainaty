import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { AuthPageSkeleton } from "@/components/auth/auth-page-layout";
import { authPageContent } from "@/components/auth/auth-page.utils";
import { RequestSetupLinkForm } from "@/components/auth/request-setup-link-form";
import { SetPasswordForm } from "@/components/auth/set-password-form";
import { getUserProfile } from "@/lib/auth/queries";
import { PATHS } from "@/lib/paths";
import { NO_INDEX_ROBOTS } from "@/lib/seo/metadata";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Ustaw hasło",
  description: "Ustaw hasło do konta utworzonego po zakupie kursu.",
  robots: NO_INDEX_ROBOTS,
};

type SetPasswordPageProps = {
  searchParams: Promise<{
    info?: string;
  }>;
};

export default async function SetPasswordPage({
  searchParams,
}: SetPasswordPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Suspense
        fallback={
          <AuthPageSkeleton
            title={authPageContent.setPassword.requestLinkTitle}
            description={authPageContent.setPassword.requestLinkDescription}
          />
        }
      >
        <RequestSetupLinkForm />
      </Suspense>
    );
  }

  const profile = await getUserProfile(supabase, user.id);

  if (!profile?.needs_password_setup) {
    redirect(PATHS.ACCOUNT);
  }

  return (
    <Suspense
      fallback={
        <AuthPageSkeleton
          title={authPageContent.setPassword.title}
          description={authPageContent.setPassword.description}
        />
      }
    >
      <SetPasswordForm showSetupHint={params.info === "setup"} />
    </Suspense>
  );
}
