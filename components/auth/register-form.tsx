"use client";

import { LockIcon, MailIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { validatePasswordConfirmation } from "@/lib/auth/password";
import { PATHS } from "@/lib/paths";

import { signUpWithPassword } from "./auth-actions.client";
import {
  AuthCard,
  AuthPageLayout,
  authEmailInputClassName,
  authPasswordInputClassName,
  AuthSwitchLink,
  authSubmitButtonClassName,
} from "./auth-page-layout";
import {
  authPageContent,
  formatAuthErrorMessage,
} from "./auth-page.utils";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextPath = searchParams.get("next") ?? PATHS.ACCOUNT;
  const content = authPageContent.register;

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

    const passwordValidation = validatePasswordConfirmation(
      password,
      passwordConfirm,
    );

    if (!passwordValidation.ok) {
      toast.error(passwordValidation.error);
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await signUpWithPassword(trimmedEmail, password);

    setIsSubmitting(false);

    if (error) {
      const message = formatAuthErrorMessage(error.message);

      toast.error(message);

      if (message === authPageContent.errors.userAlreadyRegistered) {
        router.push(PATHS.SET_PASSWORD);
      }

      return;
    }

    if (!data.session) {
      toast.success(
        "Konto utworzone. Sprawdź e-mail i potwierdź adres, jeśli otrzymałeś wiadomość.",
      );
      router.push(PATHS.LOGIN);
      return;
    }

    toast.success("Konto utworzone. Witaj!");
    router.push(nextPath);
    router.refresh();
  }

  return (
    <AuthPageLayout>
      <AuthCard
        icon={
          <UserPlusIcon
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

          <div className="space-y-2">
            <label
              htmlFor="register-password"
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
                id="register-password"
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
              htmlFor="register-password-confirm"
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
                id="register-password-confirm"
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

          <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            <input
              type="checkbox"
              checked={legalAccepted}
              onChange={(event) => setLegalAccepted(event.target.checked)}
              disabled={isSubmitting}
              className="mt-1 size-4 shrink-0 cursor-pointer rounded border-[#ddd8ce] accent-[#f24a00] dark:border-zinc-600 dark:accent-[#daff02]"
            />
            <span>
              {content.legalPrefix}{" "}
              <Link
                href={PATHS.PRIVACY}
                className="font-bold text-[#0033ff] underline-offset-2 hover:underline"
              >
                {content.privacyLabel}
              </Link>{" "}
              {content.legalJoiner}{" "}
              <Link
                href={PATHS.TERMS}
                className="font-bold text-[#0033ff] underline-offset-2 hover:underline"
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
            {isSubmitting ? "Tworzenie konta..." : content.submitLabel}
          </button>
        </form>
      </AuthCard>
    </AuthPageLayout>
  );
}
