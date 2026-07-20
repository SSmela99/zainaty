"use client";

import { LockIcon, ShieldCheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { abortPasswordRecovery, clearPasswordRecoveryPendingAction, clearPasswordSetupFlagIfNeeded } from "@/app/actions/auth";
import { signOutUser } from "@/components/auth/auth-actions.client";
import { Input } from "@/components/ui/input";
import { validatePasswordConfirmation } from "@/lib/auth/password";
import { PATHS } from "@/lib/paths";
import { createClient } from "@/lib/supabase/client";

import { updatePassword } from "./auth-actions.client";
import {
  AuthCard,
  AuthPageLayout,
  AuthPageSkeleton,
  authPasswordInputClassName,
  authSubmitButtonClassName,
} from "./auth-page-layout";
import {
  authPageContent,
  formatAuthErrorMessage,
} from "./auth-page.utils";

export function ResetPasswordForm({
  showRecoveryHint = false,
}: {
  showRecoveryHint?: boolean;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<
    "loading" | "ready" | "missing"
  >("loading");
  const [isLeaving, setIsLeaving] = useState(false);
  const content = authPageContent.resetPassword;

  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getSession().then(({ data }) => {
      setSessionStatus(data.session ? "ready" : "missing");
    });
  }, []);

  useEffect(() => {
    if (showRecoveryHint) {
      toast.success(content.recoveryHint);
    }
  }, [showRecoveryHint, content.recoveryHint]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sessionStatus !== "ready") {
      toast.error(authPageContent.errors.notAuthenticated);
      return;
    }

    const passwordValidation = validatePasswordConfirmation(
      password,
      passwordConfirm,
    );

    if (!passwordValidation.ok) {
      toast.error(passwordValidation.error);
      return;
    }

    setIsSubmitting(true);

    const { error } = await updatePassword(password);

    setIsSubmitting(false);

    if (error) {
      toast.error(formatAuthErrorMessage(error.message));
      return;
    }

    await clearPasswordSetupFlagIfNeeded();
    await clearPasswordRecoveryPendingAction();

    const supabase = createClient();
    await supabase.auth.refreshSession();

    toast.success("Hasło zostało zmienione.");
    window.location.assign(PATHS.ACCOUNT);
  }

  async function handleWrongAccount() {
    setIsLeaving(true);
    await abortPasswordRecovery();
    await signOutUser();
    router.push(PATHS.FORGOT_PASSWORD);
    router.refresh();
  }

  if (sessionStatus === "loading") {
    return (
      <AuthPageSkeleton
        title={content.title}
        description={content.description}
      />
    );
  }

  if (sessionStatus === "missing") {
    return (
      <AuthPageLayout>
        <AuthCard
          icon={
            <LockIcon
              strokeWidth={2.2}
              className="size-5 text-[#f24a00] dark:text-[#daff02]"
            />
          }
          title={content.title}
          description={authPageContent.errors.notAuthenticated}
        >
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Link resetujący wygasł lub został już użyty.
          </p>
        </AuthCard>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout>
      <AuthCard
        icon={
          <ShieldCheckIcon
            strokeWidth={2.2}
            className="size-5 text-[#f24a00] dark:text-[#daff02]"
          />
        }
        title={content.title}
        description={content.description}
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="reset-password"
              className="text-sm font-semibold text-zinc-800 dark:text-zinc-100"
            >
              {authPageContent.fields.passwordLabel}
            </label>
            <div className="relative">
              <LockIcon
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400"
              />
              <Input
                id="reset-password"
                type="password"
                name="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                autoComplete="new-password"
                placeholder={authPageContent.fields.passwordPlaceholder}
                className={authPasswordInputClassName()}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="reset-password-confirm"
              className="text-sm font-semibold text-zinc-800 dark:text-zinc-100"
            >
              {authPageContent.fields.passwordConfirmLabel}
            </label>
            <div className="relative">
              <LockIcon
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400"
              />
              <Input
                id="reset-password-confirm"
                type="password"
                name="passwordConfirm"
                required
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                disabled={isSubmitting}
                autoComplete="new-password"
                placeholder={authPageContent.fields.passwordPlaceholder}
                className={authPasswordInputClassName()}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={authSubmitButtonClassName()}
          >
            {isSubmitting ? "Zapisywanie..." : content.submitLabel}
          </button>

          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            {content.wrongAccountPrompt}{" "}
            <button
              type="button"
              onClick={() => void handleWrongAccount()}
              disabled={isSubmitting || isLeaving}
              className="font-bold text-[#f24a00] underline-offset-2 hover:underline disabled:opacity-60 dark:text-[#daff02]"
            >
              {content.wrongAccountAction}
            </button>
          </p>
        </form>
      </AuthCard>
    </AuthPageLayout>
  );
}
