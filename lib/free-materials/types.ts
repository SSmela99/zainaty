export type FreeMaterialTag = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type FreeMaterialTagInput = {
  name: string;
};

export type FreeMaterial = {
  id: string;
  title: string;
  description: string;
  tag_id: string | null;
  tag: FreeMaterialTag | null;
  cover_image_url: string | null;
  is_video: boolean;
  youtube_url: string | null;
  r2_object_key: string | null;
  file_name: string;
  sort_order: number;
  published: boolean;
  show_in_news: boolean;
  created_at: string;
  updated_at: string;
};

/** Publiczny listing — bez klucza R2 */
export type PublicFreeMaterial = {
  id: string;
  title: string;
  description: string;
  tag_id: string | null;
  tag: FreeMaterialTag | null;
  cover_image_url: string | null;
  is_video: boolean;
  youtube_url: string | null;
  file_name: string;
  sort_order: number;
  created_at: string;
  has_download: boolean;
};

export type FreeMaterialFormInput = {
  title: string;
  description: string;
  tag_id: string;
  cover_image_url: string | null;
  is_video: boolean;
  youtube_url: string | null;
  r2_object_key: string | null;
  file_name: string;
  published: boolean;
  show_in_news: boolean;
};

export type FreeMaterialLink = {
  id: string;
  title: string;
  url: string;
  description: string;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type FreeMaterialLinkFormInput = {
  title: string;
  url: string;
  description: string;
  published: boolean;
};

export type FreeMaterialActionResult<T = void> =
  | (T extends void ? { ok: true } : { ok: true; data: T })
  | { ok: false; error: string };

/** Specjalna zakładka publiczna (nie tag z DB). */
export const FREE_MATERIALS_LINKS_VIEW = "linki";

export function isFreeMaterialsLinksView(value: string | null | undefined): boolean {
  return value?.trim() === FREE_MATERIALS_LINKS_VIEW;
}

export function isYouTubeUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    const host = url.hostname.replace(/^www\./, "");
    return (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtu.be"
    );
  } catch {
    return false;
  }
}
