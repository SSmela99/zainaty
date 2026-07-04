import type { CourseKind } from "@/lib/courses/kinds";

const KIND_PREFIX: Record<CourseKind, string> = {
  training: "courses",
  video: "videos",
  package: "packages",
};

export function sanitizeR2Filename(filename: string): string {
  return filename
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildCourseR2ObjectKey(
  courseSlug: string,
  filename: string,
  kind: CourseKind,
): string {
  const safeSlug = courseSlug.trim().replace(/[^a-zA-Z0-9/_-]+/g, "-");
  const safeFilename = sanitizeR2Filename(filename);

  if (!safeSlug || !safeFilename) {
    throw new Error("Nie udało się wygenerować klucza R2.");
  }

  return `${KIND_PREFIX[kind]}/${safeSlug}/${safeFilename}`;
}
