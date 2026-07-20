"use client";

import { UserRoundIcon } from "lucide-react";
import Link from "next/link";

import { PATHS } from "@/lib/paths";
import { cn } from "@/lib/utils";

import { useAuthUser } from "./use-auth-user";

type UserAuthLinkProps = {
  overHero?: boolean;
  className?: string;
};

export function UserAuthLink({
  overHero = false,
  className,
}: UserAuthLinkProps) {
  const { email, initial, isLoggedIn, isLoading } = useAuthUser();
  const href = isLoggedIn ? PATHS.ACCOUNT : PATHS.LOGIN;

  return (
    <Link
      href={href}
      aria-label={isLoggedIn && email ? `Konto: ${email}` : "Zaloguj się"}
      title={isLoggedIn && email ? email : "Zaloguj się"}
      className={cn(
        "relative inline-flex size-10 shrink-0 items-center justify-center rounded-full transition-[transform,background-color,color,box-shadow] duration-200 ease-out",
        "hover:-translate-y-0.5 hover:scale-105",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f24a00] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent dark:focus-visible:ring-[#daff02]",
        isLoading && "pointer-events-none animate-pulse",
        isLoading
          ? overHero
            ? "bg-[#f24a00]/35"
            : "bg-[#f24a00]/25 dark:bg-[#daff02]/25"
          : isLoggedIn
            ? "bg-[#f24a00] text-sm font-black tracking-tight text-white shadow-sm dark:bg-[#daff02] dark:text-zinc-950"
            : overHero
              ? "bg-[#f24a00] text-white shadow-sm hover:brightness-110"
              : "bg-[#f24a00]/15 text-[#f24a00] ring-2 ring-inset ring-[#f24a00] hover:bg-[#f24a00] hover:text-white dark:bg-[#daff02]/15 dark:text-[#daff02] dark:ring-[#daff02] dark:hover:bg-[#daff02] dark:hover:text-zinc-950",
        className,
      )}
    >
      {!isLoading && isLoggedIn && initial ? (
        <span aria-hidden="true">{initial}</span>
      ) : !isLoading ? (
        <UserRoundIcon strokeWidth={2.2} className="size-5" aria-hidden="true" />
      ) : null}
    </Link>
  );
}
