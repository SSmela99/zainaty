import Link from "next/link";

import { logoutAction } from "@/app/admin/actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { PATHS } from "@/lib/paths";

type AdminAccessDeniedProps = {
  email?: string | null;
};

export function AdminAccessDenied({ email }: AdminAccessDeniedProps) {
  return (
    <section className="flex h-dvh flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-8 py-6">
        <Link
          href={PATHS.HOME}
          className="inline-flex cursor-pointer items-center rounded-[5px] border-2 border-[#0033ff] bg-transparent px-4 py-2.5 text-[13px] leading-none font-black text-[#0033ff] transition-transform hover:-translate-y-0.5 hover:scale-105"
        >
          Wróć na stronę
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex flex-1 items-center justify-center px-8 pb-16">
        <div className="w-full max-w-md text-center">
          <p className="text-[13px] font-bold tracking-[0.22em] text-[#0033ff] uppercase">
            Brak dostępu
          </p>
          <h1 className="mt-4 text-3xl leading-[1.1] font-black tracking-[-0.02em] md:text-4xl">
            To konto nie ma uprawnień{" "}
            <span className="text-[#f24a00] dark:text-[#daff02]">administratora</span>
          </h1>
          <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {email
              ? `Zalogowano jako ${email}. Panel admina jest dostępny tylko dla kont z rolą admin.`
              : "Panel admina jest dostępny tylko dla kont z rolą admin."}
          </p>

          <form action={logoutAction} className="mt-8">
            <button
              type="submit"
              className="h-12 w-full cursor-pointer rounded-xl bg-[#f24a00] text-sm font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-[1.02] dark:bg-[#daff02] dark:text-zinc-950"
            >
              Wyloguj się
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
