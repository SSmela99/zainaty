"use server";

import { sendPasswordSetupLink } from "@/lib/auth/password-setup";
import { validatePassword } from "@/lib/auth/password";
import { clearPasswordRecoveryPending } from "@/lib/auth/recovery";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type RequestPasswordSetupLinkResult = { ok: true };

export async function requestPasswordSetupLink(
  email: string,
): Promise<RequestPasswordSetupLinkResult> {
  try {
    await sendPasswordSetupLink(email);
  } catch (error) {
    console.error("[auth] requestPasswordSetupLink", error);
  }

  return { ok: true };
}

export type SetupInitialPasswordResult =
  | { ok: true }
  | { ok: false; error: string };

export async function setupInitialPassword(
  password: string,
): Promise<SetupInitialPasswordResult> {
  const passwordValidation = validatePassword(password);

  if (!passwordValidation.ok) {
    return { ok: false, error: passwordValidation.error };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        ok: false,
        error:
          "Sesja wygasła. Użyj linku z e-maila lub poproś o nowy link do ustawienia hasła.",
      };
    }

    const admin = createAdminClient();
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("needs_password_setup")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    if (!profile?.needs_password_setup) {
      return {
        ok: false,
        error:
          "To konto ma już ustawione hasło. Zaloguj się lub użyj opcji resetu hasła.",
      };
    }

    const { error: updateUserError } = await supabase.auth.updateUser({
      password,
    });

    if (updateUserError) {
      throw updateUserError;
    }

    const { error: profileUpdateError } = await admin
      .from("profiles")
      .update({ needs_password_setup: false })
      .eq("id", user.id);

    if (profileUpdateError) {
      throw profileUpdateError;
    }

    return { ok: true };
  } catch (error) {
    console.error("[auth] setupInitialPassword", error);

    return {
      ok: false,
      error: "Nie udało się ustawić hasła. Spróbuj ponownie.",
    };
  }
}

export async function clearPasswordRecoveryPendingAction(): Promise<void> {
  await clearPasswordRecoveryPending();
}

export async function abortPasswordRecovery(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  await clearPasswordRecoveryPending();
}

export async function clearPasswordSetupFlagIfNeeded(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const admin = createAdminClient();
  await admin
    .from("profiles")
    .update({ needs_password_setup: false })
    .eq("id", user.id)
    .eq("needs_password_setup", true);
}

export type DeleteAccountResult =
  | { ok: true }
  | { ok: false; error: string };

export async function deleteAccount(
  password: string,
): Promise<DeleteAccountResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return { ok: false, error: "Wymagane logowanie." };
  }

  if (!password) {
    return { ok: false, error: "Podaj hasło, aby potwierdzić usunięcie." };
  }

  const { error: authError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });

  if (authError) {
    return { ok: false, error: "Nieprawidłowe hasło." };
  }

  const admin = createAdminClient();
  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[auth] deleteAccount profile", profileError);
    return { ok: false, error: "Nie udało się usunąć konta. Spróbuj ponownie." };
  }

  if (profile?.role === "admin") {
    return {
      ok: false,
      error: "Konta administratora nie można usunąć z poziomu konta użytkownika.",
    };
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error("[auth] deleteAccount", deleteError);
    return { ok: false, error: "Nie udało się usunąć konta. Spróbuj ponownie." };
  }

  await supabase.auth.signOut();

  return { ok: true };
}
