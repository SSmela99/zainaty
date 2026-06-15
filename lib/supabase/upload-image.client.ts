"use client";

import { validateImageFile } from "@/lib/blog/storage";import { createClient } from "@/lib/supabase/client";

export type UploadImageResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function uploadImageToStorage(
  bucket: string,
  file: File,
): Promise<UploadImageResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Brak autoryzacji." };
  }

  const validation = validateImageFile(file);
  if (!validation.ok) {
    return validation;
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path);

  return { ok: true, url: publicUrl };
}
