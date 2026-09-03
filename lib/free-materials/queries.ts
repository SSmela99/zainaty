import { createPublicClient } from "@/lib/supabase/public";

import type {
  FreeMaterialTag,
  FreeMaterialLink,
  PublicFreeMaterial,
} from "./types";

function mapTag(row: Record<string, unknown> | null): FreeMaterialTag | null {
  if (!row) return null;

  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    created_at: row.created_at as string,
  };
}

function mapPublicFreeMaterial(row: Record<string, unknown>): PublicFreeMaterial {
  const tagRelation = row.tag as Record<string, unknown> | null | undefined;
  const objectKey = (row.r2_object_key as string | null) ?? null;

  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    tag_id: (row.tag_id as string | null) ?? null,
    tag: mapTag(tagRelation ?? null),
    cover_image_url: (row.cover_image_url as string | null) ?? null,
    is_video: Boolean(row.is_video),
    youtube_url: (row.youtube_url as string | null) ?? null,
    file_name: (row.file_name as string) ?? "",
    sort_order: row.sort_order as number,
    created_at: row.created_at as string,
    has_download: Boolean(objectKey),
  };
}

function mapPublicLink(row: Record<string, unknown>): FreeMaterialLink {
  return {
    id: row.id as string,
    title: row.title as string,
    url: row.url as string,
    description: (row.description as string) ?? "",
    sort_order: row.sort_order as number,
    published: Boolean(row.published),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

const TAG_FILTER_ORDER = [
  "e-booki",
  "checklisty",
  "templateki",
  "kolorowanki",
  "wideo",
] as const;

export async function getPublishedFreeMaterialTags(): Promise<FreeMaterialTag[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("free_material_tags")
    .select("id, name, slug, created_at")
    .order("name");

  if (error) {
    console.error("[free-materials] getPublishedFreeMaterialTags", error);
    return [];
  }

  const tags = (data ?? []).map((row) => mapTag(row as Record<string, unknown>)!);

  return tags.sort((a, b) => {
    const ai = TAG_FILTER_ORDER.indexOf(
      a.slug as (typeof TAG_FILTER_ORDER)[number],
    );
    const bi = TAG_FILTER_ORDER.indexOf(
      b.slug as (typeof TAG_FILTER_ORDER)[number],
    );
    const aRank = ai === -1 ? 999 : ai;
    const bRank = bi === -1 ? 999 : bi;
    if (aRank !== bRank) return aRank - bRank;
    return a.name.localeCompare(b.name, "pl");
  });
}

export async function getPublishedFreeMaterials(
  tagSlug?: string | null,
): Promise<PublicFreeMaterial[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  let query = supabase
    .from("free_materials")
    .select("*, tag:free_material_tags(id, name, slug, created_at)")
    .eq("published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });

  if (tagSlug) {
    const { data: tagRow } = await supabase
      .from("free_material_tags")
      .select("id")
      .eq("slug", tagSlug)
      .maybeSingle();

    if (!tagRow?.id) {
      return [];
    }

    query = query.eq("tag_id", tagRow.id);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[free-materials] getPublishedFreeMaterials", error);
    return [];
  }

  return (data ?? []).map((row) =>
    mapPublicFreeMaterial(row as Record<string, unknown>),
  );
}

export async function getPublishedFreeMaterialLinks(): Promise<
  FreeMaterialLink[]
> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("free_material_links")
    .select("*")
    .eq("published", true)
    .order("sort_order")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[free-materials] getPublishedFreeMaterialLinks", error);
    return [];
  }

  return (data ?? []).map((row) =>
    mapPublicLink(row as Record<string, unknown>),
  );
}

/** Admin / download — pełny rekord z kluczem R2 */
export async function getPublishedFreeMaterialForDownload(
  id: string,
): Promise<{
  id: string;
  title: string;
  r2_object_key: string;
  file_name: string;
} | null> {
  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("free_materials")
    .select("id, title, r2_object_key, file_name, published, is_video")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();

  if (error || !data || data.is_video || !data.r2_object_key) {
    if (error) {
      console.error("[free-materials] getPublishedFreeMaterialForDownload", error);
    }
    return null;
  }

  return {
    id: data.id as string,
    title: data.title as string,
    r2_object_key: data.r2_object_key as string,
    file_name: (data.file_name as string) ?? "",
  };
}
