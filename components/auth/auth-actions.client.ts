import { createClient } from "@/lib/supabase/client";

import { getAuthCallbackUrl } from "./auth-page.utils";

export async function sendMagicLinkLogin(email: string, nextPath?: string) {
  const supabase = createClient();

  return supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: getAuthCallbackUrl(nextPath ?? window.location.pathname),
    },
  });
}

export async function sendMagicLinkSignup(email: string, nextPath?: string) {
  const supabase = createClient();

  return supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: getAuthCallbackUrl(nextPath ?? window.location.pathname),
    },
  });
}

export async function signOutUser() {
  const supabase = createClient();
  return supabase.auth.signOut();
}
