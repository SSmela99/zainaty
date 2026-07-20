"use client";

import { KeyRoundIcon, LockIcon, MailIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { setupInitialPassword } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { validatePasswordConfirmation } from "@/lib/auth/password";
import { PATHS } from "@/lib/paths";

import {
  AuthCard,
  AuthPageLayout,
  authPasswordInputClassName,
  authSubmitButtonClassName,
} from "./auth-page-layout";
import {
  authPageContent,
  formatAuthErrorMessage,
} from "./auth-page.utils";

export function SetPasswordForm({
  showSetupHint = false,
}: {
  showSetupHint?: boolean;
}) {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const content = authPageContent.setPassword;

  useEffect(() => {
    if (showSetupHint) {
      toast.success(content.setupHint);
    }
  }, [showSetupHint, content.setupHint]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const passwordValidation = validatePasswordConfirmation(
      password,
      passwordConfirm,
    );

    if (!passwordValidation.ok) {
      toast.error(passwordValidation.error);
      return;
    }

    setIsSubmitting(true);

    const result = await setupInitialPassword(password);

    setIsSubmitting(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success("Hasło ustawione. Masz dostęp do kursów.");
    window.location.assign(PATHS.ACCOUNT);
  }

  return (
    <AuthPageLayout>
      <AuthCard
        icon={
          <KeyRoundIcon
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
              htmlFor="set-password"
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
                id="set-password"
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
              htmlFor="set-password-confirm"
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
                id="set-password-confirm"
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
        </form>
      </AuthCard>
    </AuthPageLayout>
  );
}
