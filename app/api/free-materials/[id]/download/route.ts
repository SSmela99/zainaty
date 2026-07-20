import { isR2Configured } from "@/lib/r2/config";
import { createPresignedDownloadUrl } from "@/lib/r2/presign";
import { getPublishedFreeMaterialForDownload } from "@/lib/free-materials/queries";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!id) {
    return Response.json({ error: "Nie znaleziono materiału." }, { status: 404 });
  }

  const material = await getPublishedFreeMaterialForDownload(id);

  if (!material) {
    return Response.json(
      { error: "Nie znaleziono pliku do pobrania." },
      { status: 404 },
    );
  }

  if (!isR2Configured()) {
    return Response.json(
      { error: "Pobieranie plików nie jest jeszcze skonfigurowane." },
      { status: 503 },
    );
  }

  try {
    const { url, expiresIn } = await createPresignedDownloadUrl(
      material.r2_object_key,
    );

    return Response.json({
      url,
      expiresIn,
      fileName: material.file_name || material.title,
      title: material.title,
    });
  } catch (error) {
    console.error("[free-materials/download]", error);

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
