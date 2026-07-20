import { redirect } from "next/navigation";

import { getUserProfile } from "@/lib/auth/queries";
import { hasPasswordRecoveryPending } from "@/lib/auth/recovery";
import { PATHS } from "@/lib/paths";
import { createClient } from "@/lib/supabase/server";

function buildLoginRedirect(returnPath: string) {
  return `${PATHS.LOGIN_ALIAS}?next=${encodeURIComponent(returnPath)}`;
}

function buildSetPasswordRedirect(returnPath: string) {
  return `${PATHS.SET_PASSWORD}?next=${encodeURIComponent(returnPath)}`;
}

function buildResetPasswordRedirect(returnPath: string) {
  return `${PATHS.RESET_PASSWORD}?next=${encodeURIComponent(returnPath)}`;
}

async function redirectIfPasswordRecoveryPending(
  returnPath = PATHS.ACCOUNT,
) {
  if (await hasPasswordRecoveryPending()) {
    redirect(buildResetPasswordRedirect(returnPath));
  }
}

export async function requireUser(returnPath = PATHS.ACCOUNT) {
  await redirectIfPasswordRecoveryPending(returnPath);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(buildLoginRedirect(returnPath));
  }

  const profile = await getUserProfile(supabase, user.id);

  if (profile?.needs_password_setup) {
    redirect(buildSetPasswordRedirect(returnPath));
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

  if (!user) {
    return;
  }

  if (await hasPasswordRecoveryPending()) {
    redirect(buildResetPasswordRedirect(destination));
  }

  const profile = await getUserProfile(supabase, user.id);

  if (profile?.needs_password_setup) {
    redirect(buildSetPasswordRedirect(destination));
  }

  redirect(destination);
}

export async function redirectIfPasswordAlreadySet(
  destination = PATHS.ACCOUNT,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const profile = await getUserProfile(supabase, user.id);

  if (!profile?.needs_password_setup) {
    redirect(destination);
  }
}
