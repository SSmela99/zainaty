import type { User } from "@supabase/supabase-js";

import { PATHS } from "@/lib/paths";
import { getSiteUrl } from "@/lib/stripe/config";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function findUserByEmail(email: string): Promise<User | null> {
  const admin = createAdminClient();
  const normalizedEmail = normalizeEmail(email);
  let page = 1;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });

    if (error) {
      throw error;
    }

    const match = data.users.find(
      (user) => user.email?.toLowerCase() === normalizedEmail,
    );

    if (match) {
      return match;
    }

    if (data.users.length < 200) {
      return null;
    }

    page += 1;
  }
}

export async function userNeedsPasswordSetup(email: string): Promise<boolean> {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return false;
  }

  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    return false;
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("needs_password_setup")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.needs_password_setup === true;
}

export async function sendPasswordSetupLink(email: string): Promise<void> {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return;
  }

  if (!(await userNeedsPasswordSetup(normalizedEmail))) {
    return;
  }

  const supabase = await createClient();

  await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      emailRedirectTo: `${getSiteUrl()}${PATHS.SET_PASSWORD}`,
      shouldCreateUser: false,
    },
  });
}

export const PASSWORD_SETUP_LINK_TYPES = [
  "magiclink",
  "email",
  "invite",
  "signup",
] as const;

export type PasswordSetupLinkType = (typeof PASSWORD_SETUP_LINK_TYPES)[number];

export function isPasswordSetupLinkType(
  type: string | null,
): type is PasswordSetupLinkType {
  return (
    type !== null &&
    PASSWORD_SETUP_LINK_TYPES.includes(type as PasswordSetupLinkType)
  );
}
