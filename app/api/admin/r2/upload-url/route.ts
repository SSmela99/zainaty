import { getUserProfile, isAdminRole } from "@/lib/auth/queries";
import { buildCourseR2ObjectKey } from "@/lib/r2/object-keys";
import { isR2Configured } from "@/lib/r2/config";
import { createPresignedUploadUrl } from "@/lib/r2/presign";
import { createClient } from "@/lib/supabase/server";
import type { CourseKind } from "@/lib/courses/kinds";
import { COURSE_KINDS } from "@/lib/courses/kinds";

const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
]);

type UploadUrlBody = {
  courseSlug?: string;
  filename?: string;
  contentType?: string;
  kind?: CourseKind;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Wymagane logowanie." }, { status: 401 });
  }

  const profile = await getUserProfile(supabase, user.id);

  if (!isAdminRole(profile?.role)) {
    return Response.json({ error: "Brak uprawnień administratora." }, { status: 403 });
  }

  if (!isR2Configured()) {
    return Response.json(
      { error: "Upload do R2 nie jest skonfigurowany." },
      { status: 503 },
    );
  }

  let body: UploadUrlBody;

  try {
    body = (await request.json()) as UploadUrlBody;
  } catch {
    return Response.json({ error: "Nieprawidłowe żądanie." }, { status: 400 });
  }

  const courseSlug = body.courseSlug?.trim();
  const filename = body.filename?.trim();
  const contentType = body.contentType?.trim() ?? "application/octet-stream";
  const kind = body.kind ?? "video";

  if (!courseSlug || !filename) {
    return Response.json(
      { error: "Podaj slug kursu i nazwę pliku." },
      { status: 400 },
    );
  }

  if (!COURSE_KINDS.includes(kind)) {
    return Response.json({ error: "Nieprawidłowy typ kursu." }, { status: 400 });
  }

  if (kind === "video" && !ALLOWED_VIDEO_TYPES.has(contentType)) {
    return Response.json(
      { error: "Dozwolone formaty wideo: MP4, WebM, MOV, AVI." },
      { status: 400 },
    );
  }

  try {
    const objectKey = buildCourseR2ObjectKey(courseSlug, filename, kind);
    const { url, expiresIn } = await createPresignedUploadUrl(
      objectKey,
      contentType,
    );

    return Response.json({
      uploadUrl: url,
      objectKey,
      expiresIn,
    });
  } catch (error) {
    console.error("[admin/r2/upload-url]", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nie udało się wygenerować linku do uploadu.",
      },
      { status: 500 },
    );
  }
}
