"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { isR2Configured } from "@/lib/r2/config";
import {
  createPresignedDownloadUrl,
  deleteR2Object,
  listAllR2Objects,
} from "@/lib/r2/presign";

export type R2FileUsage = {
  courseId: string;
  courseTitle: string;
};

export type R2FileItem = {
  key: string;
  size: number;
  lastModified: string | null;
  usedBy: R2FileUsage[];
};

export type R2FilesActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

async function getUsageByKey(
  supabase: Awaited<ReturnType<typeof requireAdmin>>,
): Promise<Map<string, R2FileUsage[]>> {
  const usage = new Map<string, R2FileUsage[]>();

  const { data, error } = await supabase
    .from("course_files")
    .select("r2_object_key, course:courses(id, title)");

  if (error || !data) {
    return usage;
  }

  for (const row of data as Array<{
    r2_object_key: string;
    course: { id: string; title: string } | { id: string; title: string }[] | null;
  }>) {
    const course = Array.isArray(row.course) ? row.course[0] : row.course;
    if (!course) continue;

    const existing = usage.get(row.r2_object_key) ?? [];
    existing.push({ courseId: course.id, courseTitle: course.title });
    usage.set(row.r2_object_key, existing);
  }

  return usage;
}

export async function listR2Files(): Promise<R2FilesActionResult<R2FileItem[]>> {
  try {
    const supabase = await requireAdmin();

    if (!isR2Configured()) {
      return { ok: false, error: "Cloudflare R2 nie jest skonfigurowany." };
    }

    const [objects, usage] = await Promise.all([
      listAllR2Objects(),
      getUsageByKey(supabase),
    ]);

    const items = objects
      .map((object) => ({
        key: object.key,
        size: object.size,
        lastModified: object.lastModified,
        usedBy: usage.get(object.key) ?? [],
      }))
      .sort((left, right) => left.key.localeCompare(right.key));

    return { ok: true, data: items };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Brak autoryzacji.",
    };
  }
}

export async function deleteR2File(
  key: string,
): Promise<R2FilesActionResult> {
  try {
    const supabase = await requireAdmin();

    if (!isR2Configured()) {
      return { ok: false, error: "Cloudflare R2 nie jest skonfigurowany." };
    }

    const { data, error } = await supabase
      .from("course_files")
      .select("course:courses(title)")
      .eq("r2_object_key", key);

    if (error) {
      return { ok: false, error: error.message };
    }

    if (data && data.length > 0) {
      const titles = (data as Array<{ course: { title: string } | { title: string }[] | null }>)
        .flatMap((row) => {
          const course = Array.isArray(row.course) ? row.course[0] : row.course;
          return course ? [course.title] : [];
        });

      const label = titles.length > 0 ? ` (${[...new Set(titles)].join(", ")})` : "";

      return {
        ok: false,
        error: `Plik jest używany przez kurs${label}. Odłącz go najpierw w formularzu kursu.`,
      };
    }

    await deleteR2Object(key);

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Brak autoryzacji.",
    };
  }
}

export async function getR2FileDownloadUrl(
  key: string,
): Promise<R2FilesActionResult<string>> {
  try {
    await requireAdmin();

    if (!isR2Configured()) {
      return { ok: false, error: "Cloudflare R2 nie jest skonfigurowany." };
    }

    const { url } = await createPresignedDownloadUrl(key);

    return { ok: true, data: url };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Brak autoryzacji.",
    };
  }
}
