"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

export function getEmailInitial(email: string | null | undefined): string | null {
  if (!email) {
    return null;
  }

  const trimmed = email.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.charAt(0).toUpperCase();
}

export function useAuthUser() {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getUser().then(({ data: { user } }) => {
      setEmail(user?.email ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    email,
    initial: getEmailInitial(email),
    isLoading,
    isLoggedIn: Boolean(email),
  };
}
