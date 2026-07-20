import { createClient } from "@/lib/supabase/client";

import { getPasswordResetCallbackUrl } from "./auth-page.utils";

export async function signInWithPassword(email: string, password: string) {
  const supabase = createClient();

  return supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
}

export async function signUpWithPassword(email: string, password: string) {
  const supabase = createClient();

  return supabase.auth.signUp({
    email: email.trim(),
    password,
  });
}

export async function requestPasswordReset(email: string) {
  const supabase = createClient();

  return supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: getPasswordResetCallbackUrl(),
  });
}

export async function updatePassword(password: string) {
  const supabase = createClient();

  return supabase.auth.updateUser({ password });
}

export async function signOutUser() {
  const supabase = createClient();
  return supabase.auth.signOut();
}
