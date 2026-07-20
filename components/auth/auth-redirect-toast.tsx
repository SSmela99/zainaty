"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { PATHS } from "@/lib/paths";

export function AuthRedirectToast() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const authStatus = searchParams.get("auth");
  const handledRef = useRef<string | null>(null);

  useEffect(() => {
    if (!authStatus || handledRef.current === authStatus) {
      return;
    }

    handledRef.current = authStatus;

    if (authStatus === "success") {
      if (pathname === PATHS.RESET_PASSWORD) {
        toast.success("Możesz teraz ustawić nowe hasło.");
      } else {
        toast.success("Zalogowano pomyślnie.");
      }
    } else if (authStatus === "recovery_error") {
      toast.error(
        "Link resetujący wygasł lub jest nieprawidłowy. Wyślij nowy e-mail.",
      );
    } else if (authStatus === "error") {
      toast.error("Nie udało się zalogować. Spróbuj ponownie.");
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("auth");
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [authStatus, pathname, router, searchParams]);

  return null;
}
