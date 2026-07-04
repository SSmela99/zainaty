import type { SupabaseClient } from "@supabase/supabase-js";

import { getUserProfile, isAdminRole } from "@/lib/auth/queries";

export type CoursePurchase = {
  id: string;
  user_id: string;
  course_id: string;
  purchased_at: string;
};

export async function userHasCourseAccess(
  supabase: SupabaseClient,
  userId: string,
  courseId: string,
): Promise<boolean> {
  const profile = await getUserProfile(supabase, userId);

  if (isAdminRole(profile?.role)) {
    return true;
  }

  const { data, error } = await supabase
    .from("course_purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (error) {
    return false;
  }

  return Boolean(data);
}

export async function listUserCourseIds(
  supabase: SupabaseClient,
  userId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from("course_purchases")
    .select("course_id")
    .eq("user_id", userId);

  if (error || !data) {
    return [];
  }

  return data.map((row) => row.course_id as string);
}
