export const BLOG_COVERS_BUCKET = "blog-covers";
export const AUTHOR_PHOTOS_BUCKET = "author-photos";

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const MAX_IMAGE_SIZE_LABEL = "5 MB";

export const IMAGE_UPLOAD_HINT = `Maks. ${MAX_IMAGE_SIZE_LABEL}, pliki graficzne (JPG, PNG, WebP itd.)`;

export type ImageValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export function validateImageFile(file: File): ImageValidationResult {
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "Dozwolone są tylko pliki graficzne." };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      ok: false,
      error: `Plik jest za duży. Maksymalny rozmiar to ${MAX_IMAGE_SIZE_LABEL}.`,
    };
  }

  return { ok: true };
}
