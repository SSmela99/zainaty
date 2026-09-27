"use client";

import { CircleUserIcon, LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { PATHS } from "@/lib/paths";

import { signInWithPassword } from "./auth-actions.client";
import {
  AuthCard,
  AuthPageLayout,
  authEmailInputClassName,
  authPasswordInputClassName,
  AuthSwitchLink,
  authSubmitButtonClassName,
} from "./auth-page-layout";
import { authPageContent, formatAuthErrorMessage } from "./auth-page.utils";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = searchParams.get("next") ?? PATHS.ACCOUNT;
  const content = authPageContent.login;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error(authPageContent.errors.emailRequired);
      return;
    }

    if (!password) {
      toast.error(authPageContent.errors.passwordRequired);
      return;
    }

    setIsSubmitting(true);

    const { error } = await signInWithPassword(trimmedEmail, password);

    if (error) {
      setIsSubmitting(false);
      toast.error(formatAuthErrorMessage(error.message));
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <AuthPageLayout>
      <AuthCard
        icon={
          <CircleUserIcon
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
        <form
          className="space-y-5"
          onSubmit={handleSubmit}
          aria-busy={isSubmitting}
        >
          <fieldset
            disabled={isSubmitting}
            className="space-y-5 disabled:opacity-60"
          >
            <div className="space-y-2">
              <label
                htmlFor="login-email"
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
                  id="login-email"
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  placeholder={authPageContent.fields.emailPlaceholder}
                  className={authEmailInputClassName()}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="login-password"
                  className="text-sm font-semibold text-zinc-800 dark:text-zinc-100"
                >
                  {authPageContent.fields.passwordLabel}
                </label>
                <Link
                  href={PATHS.FORGOT_PASSWORD}
                  tabIndex={isSubmitting ? -1 : undefined}
                  className="pointer-events-auto text-xs font-bold text-[#0033ff] underline-offset-2 hover:underline disabled:pointer-events-none"
                  aria-disabled={isSubmitting}
                  onClick={(event) => {
                    if (isSubmitting) event.preventDefault();
                  }}
                >
                  {content.forgotPassword}
                </Link>
              </div>
              <div className="relative">
                <LockIcon
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-zinc-400"
                />
                <Input
                  id="login-password"
                  type="password"
                  name="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  placeholder={authPageContent.fields.passwordPlaceholder}
                  className={authPasswordInputClassName()}
                />
              </div>
            </div>

            <button type="submit" className={authSubmitButtonClassName()}>
              {isSubmitting ? "Logowanie…" : content.submitLabel}
            </button>

            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              {content.firstPurchasePrompt}{" "}
              <Link
                href={`${PATHS.SET_PASSWORD}?next=${encodeURIComponent(nextPath)}`}
                tabIndex={isSubmitting ? -1 : undefined}
                aria-disabled={isSubmitting}
                onClick={(event) => {
                  if (isSubmitting) event.preventDefault();
                }}
                className="font-bold text-[#f24a00] underline-offset-2 hover:underline dark:text-[#daff02]"
              >
                {content.firstPurchaseAction}
              </Link>
            </p>
          </fieldset>
        </form>
      </AuthCard>
    </AuthPageLayout>
  );
}
