import type { User } from "@supabase/supabase-js";

import { sendPasswordSetupEmail } from "@/lib/brevo/send-password-setup-email";
import { PATHS } from "@/lib/paths";
import { getSiteUrl } from "@/lib/stripe/config";
import { createAdminClient } from "@/lib/supabase/admin";

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

async function userHasCoursePurchases(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  const { count, error } = await admin
    .from("course_purchases")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return (count ?? 0) > 0;
}

/** Admin API czasem zwraca encrypted_password — gdy pusty, konto nie ma hasła. */
function userHasPassword(user: User): boolean {
  const encrypted = (user as User & { encrypted_password?: string | null })
    .encrypted_password;

  if (encrypted === undefined) {
    return false;
  }

  return typeof encrypted === "string" && encrypted.length > 0;
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

  if (profile?.needs_password_setup === true) {
    return true;
  }

  if (!userHasPassword(user) && (await userHasCoursePurchases(user.id))) {
    return true;
  }

  return false;
}

export async function markUserNeedsPasswordSetup(userId: string): Promise<void> {
  const admin = createAdminClient();

  const { data: updated, error: updateError } = await admin
    .from("profiles")
    .update({ needs_password_setup: true })
    .eq("id", userId)
    .select("id");

  if (updateError) {
    throw updateError;
  }

  if (updated && updated.length > 0) {
    return;
  }

  const { error: insertError } = await admin.from("profiles").insert({
    id: userId,
    role: "user",
    needs_password_setup: true,
  });

  if (insertError) {
    throw insertError;
  }
}

/**
 * Wysyła link do ustawienia hasła przez Brevo.
 * Używamy admin.generateLink + token_hash (bez PKCE), żeby sesja
 * działała po kliknięciu z maila — także gdy link wysłano z webhooka.
 */
export async function sendPasswordSetupLink(email: string): Promise<void> {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return;
  }

  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    console.warn(
      `[auth] Pomijam magic link — brak konta: ${normalizedEmail}`,
    );
    return;
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("needs_password_setup")
    .eq("id", user.id)
    .maybeSingle();

  let needsSetup = profile?.needs_password_setup === true;

  if (!needsSetup) {
    const canRepair =
      !userHasPassword(user) && (await userHasCoursePurchases(user.id));

    if (canRepair) {
      await markUserNeedsPasswordSetup(user.id);
      needsSetup = true;
      console.info(
        `[auth] Naprawiono needs_password_setup dla konta z zakupem: ${normalizedEmail}`,
      );
    }
  }

  if (!needsSetup) {
    console.warn(
      `[auth] Pomijam magic link — konto nie wymaga ustawienia hasła: ${normalizedEmail}`,
    );
    return;
  }

  const redirectTo = `${getSiteUrl()}${PATHS.SET_PASSWORD}`;

  const { data: linkData, error: linkError } =
    await admin.auth.admin.generateLink({
      type: "magiclink",
      email: normalizedEmail,
      options: {
        redirectTo,
      },
    });

  if (linkError) {
    console.error("[auth] generateLink failed", linkError);
    throw linkError;
  }

  const hashedToken = linkData.properties.hashed_token;

  if (!hashedToken) {
    throw new Error("Brak hashed_token z generateLink.");
  }

  const setupUrl = new URL(redirectTo);
  setupUrl.searchParams.set("token_hash", hashedToken);
  setupUrl.searchParams.set("type", "magiclink");

  await sendPasswordSetupEmail({
    email: normalizedEmail,
    setupUrl: setupUrl.toString(),
  });

  console.info(
    `[auth] Wysłano link do ustawienia hasła (Brevo): ${normalizedEmail}`,
  );
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
