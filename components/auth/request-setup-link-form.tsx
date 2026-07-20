"use client";

import { KeyRoundIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { requestPasswordSetupLink } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { PATHS } from "@/lib/paths";

import {
  AuthCard,
  AuthPageLayout,
  authEmailInputClassName,
  AuthSwitchLink,
  authSubmitButtonClassName,
} from "./auth-page-layout";
import { authPageContent } from "./auth-page.utils";

export function RequestSetupLinkForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const content = authPageContent.setPassword;

  useEffect(() => {
    if (searchParams.get("auth") === "setup_error") {
      toast.error(content.setupLinkError);
    }
  }, [searchParams, content.setupLinkError]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error(authPageContent.errors.emailRequired);
      return;
    }

    setIsSubmitting(true);
    await requestPasswordSetupLink(trimmedEmail);
    setIsSubmitting(false);
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
          description={content.setupLinkSent}
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
          <KeyRoundIcon
            strokeWidth={2.2}
            className="size-5 text-[#f24a00] dark:text-[#daff02]"
          />
        }
        title={content.requestLinkTitle}
        description={content.requestLinkDescription}
        footer={
          <AuthSwitchLink
            prompt={content.switchPrompt}
            action={content.switchAction}
            href={PATHS.LOGIN}
          />
        }
      >
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="setup-link-email"
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
                id="setup-link-email"
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
            <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              {content.requestLinkHint}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={authSubmitButtonClassName()}
          >
            {isSubmitting ? "Wysyłanie..." : content.requestLinkSubmit}
          </button>

          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            {content.forgotPasswordPrompt}{" "}
            <Link
              href={PATHS.FORGOT_PASSWORD}
              className="font-bold text-[#f24a00] underline-offset-2 hover:underline dark:text-[#daff02]"
            >
              {content.forgotPasswordAction}
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthPageLayout>
  );
}
