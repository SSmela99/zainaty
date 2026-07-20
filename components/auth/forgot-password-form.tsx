"use client";

import { LockIcon, MailIcon, RotateCcwIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";

import { requestPasswordReset } from "./auth-actions.client";
import {
  AuthCard,
  AuthPageLayout,
  authEmailInputClassName,
  AuthSwitchLink,
  authSubmitButtonClassName,
} from "./auth-page-layout";
import {
  authPageContent,
  formatAuthErrorMessage,
} from "./auth-page.utils";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const content = authPageContent.forgotPassword;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error(authPageContent.errors.emailRequired);
      return;
    }

    setIsSubmitting(true);

    const { error } = await requestPasswordReset(trimmedEmail);

    setIsSubmitting(false);

    if (error) {
      toast.error(formatAuthErrorMessage(error.message));
      return;
    }

    setIsSent(true);
  }

  if (isSent) {
    return (
      <AuthPageLayout>
        <AuthCard
          icon={
            <MailIcon
              strokeWidth={2.2}
              className="size-5 text-[#f24a00] dark:text-[#daff02]"
            />
          }
          title={authPageContent.sent.title}
          description={authPageContent.sent.description}
        >
          <button
            type="button"
            onClick={() => setIsSent(false)}
            className="w-full text-center text-sm font-bold text-[#f24a00] underline-offset-2 hover:underline dark:text-[#daff02]"
          >
            Wyślij ponownie
          </button>
        </AuthCard>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout>
      <AuthCard
        icon={
          <RotateCcwIcon
            strokeWidth={2.2}
            className="size-5 text-[#f24a00] dark:text-[#daff02]"
          />
        }
        title={content.title}
        description={content.description}
        footer={
          <AuthSwitchLink
            prompt={content.switchPrompt}
            action={content.switchAction}
            href={content.switchHref}
          />
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="forgot-password-email"
              className="text-sm font-semibold text-zinc-800 dark:text-zinc-100"
            >
              {authPageContent.fields.emailLabel}
            </label>
            <div className="relative">
              <MailIcon
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400"
              />
              <Input
                id="forgot-password-email"
                type="email"
                name="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isSubmitting}
                autoComplete="email"
                placeholder={authPageContent.fields.emailPlaceholder}
                className={authEmailInputClassName()}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={authSubmitButtonClassName()}
          >
            {isSubmitting ? "Wysyłanie..." : content.submitLabel}
          </button>
        </form>
      </AuthCard>
    </AuthPageLayout>
  );
}
