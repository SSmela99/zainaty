import type { SupabaseClient } from "@supabase/supabase-js";

import { USER_ROLE, type UserProfile, type UserRole } from "./types";

export function isAdminRole(role: UserRole | null | undefined): boolean {
  return role === USER_ROLE.ADMIN;
}

export async function getUserProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as UserProfile;
}

export async function getCurrentUserRole(
  supabase: SupabaseClient,
): Promise<UserRole | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const profile = await getUserProfile(supabase, user.id);
  return profile?.role ?? null;
}
