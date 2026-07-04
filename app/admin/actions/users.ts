"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import type {
  AdminUser,
  CourseOption,
  UserPurchasedCourse,
  UsersActionResult,
  UsersListParams,
  UsersListResult,
} from "@/lib/users/types";

import { USERS_PAGE_SIZE } from "@/lib/users/constants";

function mapAdminUser(row: Record<string, unknown>): AdminUser {
  return {
    id: row.id as string,
    email: row.email as string,
    role: row.role as AdminUser["role"],
    created_at: row.created_at as string,
    last_sign_in_at: (row.last_sign_in_at as string | null) ?? null,
  };
}

export async function listUsers(
  params: UsersListParams = {},
): Promise<UsersActionResult<UsersListResult>> {
  try {
    const supabase = await requireAdmin();
    const page = Math.max(params.page ?? 1, 1);
    const pageSize = params.pageSize ?? USERS_PAGE_SIZE;
    const search = params.search?.trim() ?? "";

    const { data, error } = await supabase.rpc("list_users_for_admin", {
      p_search: search,
      p_page: page,
      p_page_size: pageSize,
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    const rows = (data ?? []) as Array<Record<string, unknown>>;
    const total =
      rows.length > 0 ? Number(rows[0].total_count ?? rows.length) : 0;

    return {
      ok: true,
      data: {
        items: rows.map(mapAdminUser),
        total,
        page,
        pageSize,
      },
    };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function listUserPurchasedCourses(
  userId: string,
): Promise<UsersActionResult<UserPurchasedCourse[]>> {
  try {
    const supabase = await requireAdmin();

    const { data, error } = await supabase
      .from("course_purchases")
      .select("purchased_at, course:courses(id, title, slug)")
      .eq("user_id", userId)
      .order("purchased_at", { ascending: false });

    if (error) {
      return { ok: false, error: error.message };
    }

    const items = (data ?? []).flatMap((row) => {
      const course = row.course as
        | { id: string; title: string; slug: string }
        | { id: string; title: string; slug: string }[]
        | null;

      const courseData = Array.isArray(course) ? course[0] : course;
      if (!courseData) return [];

      return [
        {
          course_id: courseData.id,
          title: courseData.title,
          slug: courseData.slug,
          purchased_at: row.purchased_at as string,
        },
      ];
    });

    return { ok: true, data: items };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function listCourseOptions(): Promise<
  UsersActionResult<CourseOption[]>
> {
  try {
    const supabase = await requireAdmin();

    const { data, error } = await supabase
      .from("courses")
      .select("id, title, slug")
      .order("title");

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: data ?? [] };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function grantUserCourse(
  userId: string,
  courseId: string,
): Promise<UsersActionResult<UserPurchasedCourse>> {
  try {
    const supabase = await requireAdmin();

    const { error } = await supabase.from("course_purchases").upsert(
      { user_id: userId, course_id: courseId },
      { onConflict: "user_id,course_id" },
    );

    if (error) {
      return { ok: false, error: error.message };
    }

    const { data, error: fetchError } = await supabase
      .from("course_purchases")
      .select("purchased_at, course:courses(id, title, slug)")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .single();

    if (fetchError || !data) {
      return { ok: false, error: fetchError?.message ?? "Nie udało się dodać kursu." };
    }

    const course = data.course as
      | { id: string; title: string; slug: string }
      | { id: string; title: string; slug: string }[]
      | null;
    const courseData = Array.isArray(course) ? course[0] : course;

    if (!courseData) {
      return { ok: false, error: "Nie znaleziono kursu." };
    }

    return {
      ok: true,
      data: {
        course_id: courseData.id,
        title: courseData.title,
        slug: courseData.slug,
        purchased_at: data.purchased_at as string,
      },
    };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function revokeUserCourse(
  userId: string,
  courseId: string,
): Promise<UsersActionResult<null>> {
  try {
    const supabase = await requireAdmin();

    const { error } = await supabase
      .from("course_purchases")
      .delete()
      .eq("user_id", userId)
      .eq("course_id", courseId);

    if (error) {
      return { ok: false, error: error.message };
    }

    return { ok: true, data: null };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}
