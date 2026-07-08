import type { CourseKind } from "@/lib/courses/kinds";

type UploadVideoToR2Options = {
  file: File;
  courseSlug: string;
  kind?: CourseKind;
  onProgress?: (progress: number) => void;
};

type UploadVideoToR2Result =
  | { ok: true; objectKey: string }
  | { ok: false; error: string };

async function requestUploadAndSend(
  body: Record<string, unknown>,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<UploadVideoToR2Result> {
  const presignResponse = await fetch("/api/admin/r2/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...body,
      filename: file.name,
      contentType: file.type || "application/octet-stream",
    }),
  });

  const presignPayload = (await presignResponse.json()) as {
    uploadUrl?: string;
    objectKey?: string;
    error?: string;
  };

  if (!presignResponse.ok || !presignPayload.uploadUrl || !presignPayload.objectKey) {
    return {
      ok: false,
      error: presignPayload.error ?? "Nie udało się przygotować uploadu.",
    };
  }

  try {
    await uploadWithProgress(
      presignPayload.uploadUrl,
      file,
      file.type || "application/octet-stream",
      onProgress,
    );

    return { ok: true, objectKey: presignPayload.objectKey };
  } catch {
    return { ok: false, error: "Upload pliku do R2 nie powiódł się." };
  }
}

export async function uploadVideoToR2({
  file,
  courseSlug,
  kind = "video",
  onProgress,
}: UploadVideoToR2Options): Promise<UploadVideoToR2Result> {
  return requestUploadAndSend({ courseSlug, kind }, file, onProgress);
}

type UploadFileToR2Options = {
  file: File;
  prefix: string;
  onProgress?: (progress: number) => void;
};

export async function uploadFileToR2({
  file,
  prefix,
  onProgress,
}: UploadFileToR2Options): Promise<UploadVideoToR2Result> {
  return requestUploadAndSend({ prefix }, file, onProgress);
}

function uploadWithProgress(
  uploadUrl: string,
  file: File,
  contentType: string,
  onProgress?: (progress: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", contentType);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(100);
        resolve();
        return;
      }

      reject(new Error(`Upload failed with status ${xhr.status}`));
    };

    xhr.onerror = () =>
      reject(
        new Error(
          "Upload zablokowany (CORS). W Cloudflare R2 → bucket → Settings → CORS Policy wklej konfigurację z lib/r2/cors-policy.example.json (dodaj swoją domenę produkcyjną).",
        ),
      );
    xhr.send(file);
  });
}
