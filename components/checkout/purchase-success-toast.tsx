"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function PurchaseSuccessToast() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const purchaseStatus = searchParams.get("zakup");
  const handledRef = useRef(false);

  useEffect(() => {
    if (purchaseStatus !== "ok" || handledRef.current) {
      return;
    }

    handledRef.current = true;

    const isLoginPage = pathname === "/logowanie" || pathname === "/login";

    if (isLoginPage) {
      toast.success(
        "Płatność przyjęta! Zaloguj się tym samym adresem e-mail, który podałeś przy płatności.",
        { duration: 8000 },
      );
    } else {
      toast.success("Płatność przyjęta! Kurs jest dostępny na Twoim koncie.");
    }

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete("zakup");
    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, purchaseStatus, router, searchParams]);

  return null;
}
