"use client";

import { MailIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { PATHS } from "@/lib/paths";

import { sendMagicLinkSignup } from "./auth-actions.client";
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

export function RegisterForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const nextPath = searchParams.get("next") ?? PATHS.HOME;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error(authPageContent.errors.emailRequired);
      return;
    }

    if (!legalAccepted) {
      toast.error(authPageContent.errors.legalRequired);
      return;
    }

    setIsSubmitting(true);

    const { error } = await sendMagicLinkSignup(trimmedEmail, nextPath);

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
              className="size-5 text-[#ff4b12] dark:text-[#d7ff00]"
            />
          }
          title={authPageContent.sent.title}
          description={authPageContent.sent.description}
        >
          <button
            type="button"
            onClick={() => setIsSent(false)}
            className="w-full text-center text-sm font-bold text-[#ff4b12] underline-offset-2 hover:underline dark:text-[#d7ff00]"
          >
            Wyślij link ponownie
          </button>
        </AuthCard>
      </AuthPageLayout>
    );
  }

  const content = authPageContent.register;

  return (
    <AuthPageLayout>
      <AuthCard
        icon={
          <UserPlusIcon
            strokeWidth={2.2}
            className="size-5 text-[#ff4b12] dark:text-[#d7ff00]"
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
              htmlFor="register-email"
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
                id="register-email"
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

          <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={legalAccepted}
              onChange={(event) => setLegalAccepted(event.target.checked)}
              disabled={isSubmitting}
              className="mt-1 size-4 shrink-0 cursor-pointer rounded border-[#ded9cf] accent-[#ff4b12] dark:border-zinc-600 dark:accent-[#d7ff00]"
            />
            <span>
              {content.legalPrefix}{" "}
              <Link
                href={PATHS.PRIVACY}
                className="font-bold text-[#1a4dff] underline-offset-2 hover:underline"
              >
                {content.privacyLabel}
              </Link>{" "}
              {content.legalJoiner}{" "}
              <Link
                href={PATHS.TERMS}
                className="font-bold text-[#1a4dff] underline-offset-2 hover:underline"
              >
                {content.termsLabel}
              </Link>
            </span>
          </label>

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
