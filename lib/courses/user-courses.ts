import type { CourseFileType } from "@/lib/courses/types";
import { createClient } from "@/lib/supabase/server";

export type UserAccessibleCourseFile = {
  id: string;
  title: string;
  file_type: CourseFileType;
};

export type UserAccessibleCourse = {
  id: string;
  title: string;
  slug: string;
  purchased_at: string;
  files: UserAccessibleCourseFile[];
};

type CourseFileRow = {
  id: string;
  title: string;
  file_type: string;
  sort_order: number;
};

type CourseRow = {
  id: string;
  title: string;
  slug: string;
  kind: string;
  files: CourseFileRow[] | null;
};

type PurchaseRow = {
  purchased_at: string;
  course: CourseRow | CourseRow[] | null;
};

function normalizeCourse(
  course: CourseRow | CourseRow[] | null,
): CourseRow | null {
  if (!course) return null;
  return Array.isArray(course) ? (course[0] ?? null) : course;
}

export async function listUserAccessibleCourses(): Promise<UserAccessibleCourse[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("course_purchases")
    .select(
      `
      purchased_at,
      course:courses (
        id,
        title,
        slug,
        kind,
        files:course_files (
          id,
          title,
          file_type,
          sort_order
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("purchased_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as PurchaseRow[]).flatMap((row) => {
    const course = normalizeCourse(row.course);
    if (!course) return [];

    // Pakiety nie mają własnych plików — po zakupie użytkownik ma dostęp do
    // kursów składowych, więc nie pokazujemy kafelka samego pakietu.
    if (course.kind === "package") return [];

    const files = (course.files ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((file) => ({
        id: file.id,
        title: file.title,
        file_type: file.file_type as CourseFileType,
      }));

    return [
      {
        id: course.id,
        title: course.title,
        slug: course.slug,
        purchased_at: row.purchased_at,
        files,
      },
    ];
  });
}
