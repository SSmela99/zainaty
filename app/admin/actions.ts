"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUserProfile, isAdminRole } from "@/lib/auth/queries";
import { createClient } from "@/lib/supabase/server";

export type AdminAuthState = {
  error?: string;
};

export async function loginAction(
  _prevState: AdminAuthState,
  formData: FormData,
): Promise<AdminAuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Podaj email i hasło." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: "Nieprawidłowy email lub hasło." };
  }

  const profile = await getUserProfile(supabase, data.user.id);

  if (!isAdminRole(profile?.role)) {
    await supabase.auth.signOut();
    return { error: "To konto nie ma uprawnień administratora." };
  }

  revalidatePath("/admin");
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/admin");
  redirect("/admin");
}
