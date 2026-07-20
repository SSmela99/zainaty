import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";

import { PATHS } from "@/lib/paths";
import { cn } from "@/lib/utils";

import { authPageContent } from "./auth-page.utils";

type AuthPageLayoutProps = {
  children: React.ReactNode;
};

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-8 py-16 md:py-24">
      <div className="w-full max-w-md">{children}</div>
      <Link
        href={PATHS.HOME}
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 transition-colors hover:text-[#f24a00] dark:text-zinc-400 dark:hover:text-[#daff02]"
      >
        <ArrowLeftIcon className="size-4" strokeWidth={2.2} />
        {authPageContent.backHome}
      </Link>
    </section>
  );
}

/** Placeholder karty auth — zamiast pustego Suspense fallback={null}. */
export function AuthPageSkeleton({
  title = "Ładowanie…",
  description = "Chwila, przygotowujemy formularz.",
}: {
  title?: string;
  description?: string;
} = {}) {
  return (
    <AuthPageLayout>
      <div
        aria-busy="true"
        aria-live="polite"
        className="rounded-3xl border border-[#ddd8ce] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:border-[#282828] dark:bg-[#1c1c1c] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
      >
        <div className="flex flex-col items-center text-center">
          <div className="flex size-12 animate-pulse items-center justify-center rounded-xl bg-[#ffd0bc] dark:bg-[#3a4500]" />
          <h1 className="mt-6 text-2xl leading-[1.15] font-black tracking-[-0.02em] text-zinc-950 dark:text-white">
            {title}
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-[#f5f2e9] dark:bg-[#151414]" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-[#f5f2e9] dark:bg-[#151414]" />
          </div>
          <div className="h-12 w-full animate-pulse rounded-xl bg-[#f24a00]/35 dark:bg-[#daff02]/30" />
        </div>
      </div>
    </AuthPageLayout>
  );
}

type AuthCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthCard({
  icon,
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="rounded-3xl border border-[#ddd8ce] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] dark:border-[#282828] dark:bg-[#1c1c1c] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-[#ffd0bc] dark:bg-[#3a4500]">
          {icon}
        </div>

        <h1 className="mt-6 text-2xl leading-[1.15] font-black tracking-[-0.02em] text-zinc-950 dark:text-white">
          {title}
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
      </div>

      <div className="mt-8">{children}</div>

      {footer ? <div className="mt-8">{footer}</div> : null}
    </div>
  );
}

export function AuthSwitchLink({
  prompt,
  action,
  href,
}: {
  prompt: string;
  action: string;
  href: string;
}) {
  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#ddd8ce] dark:border-[#333333]" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 font-semibold tracking-[0.18em] text-zinc-400 dark:bg-[#1c1c1c] dark:text-zinc-500">
            {authPageContent.divider}
          </span>
        </div>
      </div>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        {prompt}{" "}
        <Link
          href={href}
          className="font-bold text-[#f24a00] underline-offset-2 hover:underline dark:text-[#daff02]"
        >
          {action}
        </Link>
      </p>
    </>
  );
}

export function authPasswordInputClassName(className?: string) {
  return cn(
    "h-12 rounded-xl border border-[#ddd8ce] bg-[#f5f2e9] pl-11 text-base text-zinc-950 placeholder:text-zinc-400 focus-visible:border-[#f24a00]/40 focus-visible:ring-[#f24a00]/15 dark:border-zinc-700 dark:bg-[#151414] dark:text-white dark:placeholder:text-zinc-500 dark:focus-visible:border-[#daff02]/40 dark:focus-visible:ring-[#daff02]/15",
    className,
  );
}

export function authEmailInputClassName(className?: string) {
  return cn(
    "h-12 rounded-xl border border-[#ddd8ce] bg-[#f5f2e9] pl-11 text-base text-zinc-950 placeholder:text-zinc-400 focus-visible:border-[#f24a00]/40 focus-visible:ring-[#f24a00]/15 dark:border-zinc-700 dark:bg-[#151414] dark:text-white dark:placeholder:text-zinc-500 dark:focus-visible:border-[#daff02]/40 dark:focus-visible:ring-[#daff02]/15",
    className,
  );
}

export function authSubmitButtonClassName(className?: string) {
  return cn(
    "h-12 w-full cursor-pointer rounded-xl bg-[#f24a00] text-sm font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 dark:bg-[#daff02] dark:text-zinc-950",
    className,
  );
}
