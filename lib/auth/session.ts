import { redirect } from "next/navigation";

import { PATHS } from "@/lib/paths";
import { createClient } from "@/lib/supabase/server";

export async function requireUser(returnPath = PATHS.ACCOUNT) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = `${PATHS.LOGIN_ALIAS}?next=${encodeURIComponent(returnPath)}`;
    redirect(loginUrl);
  }

  return user;
}

export async function redirectIfAuthenticated(
  destination = PATHS.ACCOUNT,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(destination);
  }
}
