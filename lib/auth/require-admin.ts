import { getUserProfile, isAdminRole } from "@/lib/auth/queries";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Brak autoryzacji.");
  }

  const profile = await getUserProfile(supabase, user.id);

  if (!isAdminRole(profile?.role)) {
    throw new Error("Brak uprawnień administratora.");
  }

  return supabase;
}
