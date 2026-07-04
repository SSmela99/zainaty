import { createClient } from "@/lib/supabase/server";
import { createPresignedDownloadUrl } from "@/lib/r2/presign";
import { isR2Configured } from "@/lib/r2/config";

type RouteContext = {
  params: Promise<{ courseId: string; fileId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { courseId, fileId } = await context.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Wymagane logowanie." }, { status: 401 });
  }

  const { data: fileRows, error: fileError } = await supabase.rpc(
    "get_course_file_download_key",
    {
      p_course_id: courseId,
      p_file_id: fileId,
    },
  );

  const file = fileRows?.[0];

  if (fileError || !file) {
    const isForbidden =
      fileError?.message?.toLowerCase().includes("not authorized") ?? false;

    return Response.json(
      {
        error: isForbidden
          ? "Brak dostępu do tego kursu. Kup kurs, aby uzyskać stały dostęp."
          : "Nie znaleziono pliku.",
      },
      { status: isForbidden ? 403 : 404 },
    );
  }

  if (!isR2Configured()) {
    return Response.json(
      { error: "Pobieranie plików nie jest jeszcze skonfigurowane (R2)." },
      { status: 503 },
    );
  }

  try {
    const { url, expiresIn } = await createPresignedDownloadUrl(file.r2_object_key);

    return Response.json({
      url,
      expiresIn,
      fileType: file.file_type,
      title: file.title,
      access: "permanent",
      message:
        "Masz stały dostęp do tego kursu. Link do pobrania jest krótkotrwały ze względów bezpieczeństwa — wygeneruj go ponownie w dowolnym momencie.",
    });
  } catch (error) {
    console.error("[courses/file/url]", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Nie udało się wygenerować linku do pliku.",
      },
      { status: 500 },
    );
  }
}
