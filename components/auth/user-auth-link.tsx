"use client";

import { CircleUserIcon } from "lucide-react";
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
  const { email, initial, isLoggedIn } = useAuthUser();

  return (
    <Link
      href={PATHS.ACCOUNT}
      aria-label={isLoggedIn && email ? `Konto: ${email}` : "Zaloguj się"}
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 transition-transform hover:-translate-y-0.5 hover:scale-105",
        isLoggedIn
          ? "border-transparent bg-[#ff4b12] text-sm font-black text-white dark:bg-[#d7ff00] dark:text-zinc-950"
          : overHero
            ? "border-[#d7ff00] bg-transparent text-[#d7ff00]"
            : "border-[#ff4b12] bg-transparent text-[#ff4b12] dark:border-[#d7ff00] dark:text-[#d7ff00]",
        className,
      )}
    >
      {isLoggedIn && initial ? (
        <span aria-hidden="true">{initial}</span>
      ) : (
        <CircleUserIcon strokeWidth={2.2} className="size-5" />
      )}
    </Link>
  );
}
