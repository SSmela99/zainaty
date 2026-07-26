"use client";

import { useActionState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginAction, type AdminAuthState } from "@/app/admin/actions";

const initialState: AdminAuthState = {};

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <div className="w-full">
      <p className="text-[13px] font-bold tracking-[0.22em] text-[#0033ff] uppercase">
        Panel admina
      </p>
      <h1 className="mt-4 text-3xl leading-[1.1] font-black tracking-[0.02em] md:text-4xl">
        Zaloguj się, by{" "}
        <span className="text-[#f24a00] dark:text-[#daff02]">
          edytować treści
        </span>
      </h1>
      <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        Użyj konta administratora utworzonego w Supabase Auth.
      </p>

      <form action={formAction} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="admin@example.com"
            className="h-12 rounded-xl border-transparent bg-white px-4 text-base text-zinc-950 placeholder:text-zinc-400 dark:border-white/10 dark:bg-[#1c1c1c] dark:text-white dark:placeholder:text-zinc-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Hasło</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            className="h-12 rounded-xl border-transparent bg-white px-4 text-base text-zinc-950 placeholder:text-zinc-400 dark:border-white/10 dark:bg-[#1c1c1c] dark:text-white dark:placeholder:text-zinc-500"
          />
        </div>

        {state.error ? (
          <p className="text-sm font-medium text-[#f24a00] dark:text-[#daff02]">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="h-12 w-full cursor-pointer rounded-xl bg-[#f24a00] text-sm font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#daff02] dark:text-zinc-950"
        >
          {isPending ? "Logowanie..." : "Zaloguj się"}
        </button>
      </form>
    </div>
  );
}
