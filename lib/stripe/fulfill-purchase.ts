import type { User } from "@supabase/supabase-js";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendPasswordSetupLink } from "@/lib/auth/password-setup";
import { incrementDiscountCodeUsage } from "@/lib/discount-codes/validate";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function findUserByEmail(
  email: string,
): Promise<User | null> {
  const admin = createAdminClient();
  const normalizedEmail = normalizeEmail(email);
  let page = 1;

  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });

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

async function findOrCreateUserByEmail(
  email: string,
): Promise<{ user: User; created: boolean }> {
  const admin = createAdminClient();
  const normalizedEmail = normalizeEmail(email);

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: normalizedEmail,
    email_confirm: true,
  });

  if (created.user) {
    const { error: profileError } = await admin
      .from("profiles")
      .update({ needs_password_setup: true })
      .eq("id", created.user.id);

    if (profileError) {
      throw profileError;
    }

    return { user: created.user, created: true };
  }

  const alreadyExists =
    createError?.message?.toLowerCase().includes("already") ||
    createError?.status === 422;

  if (alreadyExists) {
    const existing = await findUserByEmail(normalizedEmail);

    if (existing) {
      return { user: existing, created: false };
    }
  }

  throw createError ?? new Error("Nie udało się utworzyć konta użytkownika.");
}

async function resolveEntitlementCourseIds(
  admin: ReturnType<typeof createAdminClient>,
  courseId: string,
): Promise<string[]> {
  const courseIds = new Set<string>([courseId]);

  const { data, error } = await admin
    .from("course_package_items")
    .select("course_id")
    .eq("package_id", courseId);

  if (error) {
    throw error;
  }

  for (const row of data ?? []) {
    courseIds.add(row.course_id as string);
  }

  return [...courseIds];
}

export async function fulfillCoursePurchase(params: {
  email: string;
  courseId: string;
  stripeSessionId: string;
  discountCodeId?: string | null;
}): Promise<void> {
  const admin = createAdminClient();
  const { user, created } = await findOrCreateUserByEmail(params.email);

  const courseIds = await resolveEntitlementCourseIds(admin, params.courseId);

  const { error } = await admin.from("course_purchases").upsert(
    courseIds.map((course_id) => ({
      user_id: user.id,
      course_id,
    })),
    { onConflict: "user_id,course_id" },
  );

  if (error) {
    throw error;
  }

  if (params.discountCodeId) {
    await incrementDiscountCodeUsage(params.discountCodeId);
  }

  if (created) {
    try {
      await sendPasswordSetupLink(params.email);
    } catch (error) {
      console.error("[stripe] sendPasswordSetupLink", error);
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.info(
      `[stripe] Purchase fulfilled: session=${params.stripeSessionId} user=${user.id} course=${params.courseId}`,
    );
  }
}
