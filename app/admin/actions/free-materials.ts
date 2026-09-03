"use server";

import { revalidatePath, updateTag } from "next/cache";
import * as yup from "yup";

import { requireAdmin } from "@/lib/auth/require-admin";
import { slugify } from "@/lib/blog/slug";
import {
  isYouTubeUrl,
  type FreeMaterial,
  type FreeMaterialActionResult,
  type FreeMaterialFormInput,
  type FreeMaterialLink,
  type FreeMaterialLinkFormInput,
  type FreeMaterialTag,
  type FreeMaterialTagInput,
} from "@/lib/free-materials/types";
import { PATHS } from "@/lib/paths";
import { freeMaterialLinkSchema } from "@/lib/validation/admin-free-materials.schemas";

const FREE_MATERIAL_SELECT =
  "*, tag:free_material_tags(id, name, slug, created_at)";

function mapTag(row: Record<string, unknown> | null): FreeMaterialTag | null {
  if (!row) return null;

  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    created_at: row.created_at as string,
  };
}

function mapFreeMaterial(row: Record<string, unknown>): FreeMaterial {
  const tagRelation = row.tag as Record<string, unknown> | null | undefined;

  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    tag_id: (row.tag_id as string | null) ?? null,
    tag: mapTag(tagRelation ?? null),
    cover_image_url: (row.cover_image_url as string | null) ?? null,
    is_video: Boolean(row.is_video),
    youtube_url: (row.youtube_url as string | null) ?? null,
    r2_object_key: (row.r2_object_key as string | null) ?? null,
    file_name: (row.file_name as string) ?? "",
    sort_order: row.sort_order as number,
    published: row.published as boolean,
    show_in_news: (row.show_in_news as boolean | undefined) ?? false,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

function sanitizeInput(input: FreeMaterialFormInput): FreeMaterialFormInput {
  const isVideo = Boolean(input.is_video);

  return {
    title: input.title.trim(),
    description: input.description.trim(),
    tag_id: input.tag_id.trim(),
    cover_image_url: input.cover_image_url?.trim() || null,
    is_video: isVideo,
    youtube_url: isVideo ? input.youtube_url?.trim() || null : null,
    r2_object_key: isVideo ? null : input.r2_object_key?.trim() || null,
    file_name: isVideo ? "" : input.file_name.trim(),
    published: input.published,
    show_in_news: input.show_in_news,
  };
}

function validatePayload(payload: FreeMaterialFormInput): string | null {
  if (!payload.tag_id) {
    return "Wybierz tag.";
  }

  if (payload.is_video) {
    if (!payload.youtube_url) {
      return "Link do YouTube jest wymagany.";
    }
    if (!isYouTubeUrl(payload.youtube_url)) {
      return "Podaj poprawny link YouTube (youtube.com lub youtu.be).";
    }
    return null;
  }

  if (!payload.r2_object_key || payload.r2_object_key === "pending") {
    return "Plik do pobrania jest wymagany.";
  }

  return null;
}

function revalidateFreeMaterialPaths() {
  revalidatePath("/admin");
  revalidatePath(PATHS.FREE_MATERIALS);
  revalidatePath(PATHS.HOME);
  updateTag("home-news");
}

export async function listFreeMaterialTags(): Promise<
  FreeMaterialActionResult<FreeMaterialTag[]>
> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("free_material_tags")
      .select("*")
      .order("name");

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []).map((row) => mapTag(row)!) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function createFreeMaterialTag(
  input: FreeMaterialTagInput,
): Promise<FreeMaterialActionResult<FreeMaterialTag>> {
  try {
    const supabase = await requireAdmin();
    const name = input.name.trim();
    const slug = slugify(name);

    if (!slug) {
      return { ok: false, error: "Nieprawidłowa nazwa tagu." };
    }

    const { data, error } = await supabase
      .from("free_material_tags")
      .insert({ name, slug })
      .select("*")
      .single();

    if (error) return { ok: false, error: error.message };

    revalidateFreeMaterialPaths();
    return { ok: true, data: mapTag(data)! };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function updateFreeMaterialTag(
  id: string,
  input: FreeMaterialTagInput,
): Promise<FreeMaterialActionResult<FreeMaterialTag>> {
  try {
    const supabase = await requireAdmin();
    const name = input.name.trim();
    const slug = slugify(name);

    if (!slug) {
      return { ok: false, error: "Nieprawidłowa nazwa tagu." };
    }

    const { data, error } = await supabase
      .from("free_material_tags")
      .update({ name, slug })
      .eq("id", id)
      .select("*")
      .single();

    if (error) return { ok: false, error: error.message };

    revalidateFreeMaterialPaths();
    return { ok: true, data: mapTag(data)! };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function deleteFreeMaterialTag(
  id: string,
): Promise<FreeMaterialActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase
      .from("free_material_tags")
      .delete()
      .eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidateFreeMaterialPaths();
    return { ok: true };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function listFreeMaterials(): Promise<
  FreeMaterialActionResult<FreeMaterial[]>
> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("free_materials")
      .select(FREE_MATERIAL_SELECT)
      .order("sort_order")
      .order("created_at", { ascending: false });

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []).map(mapFreeMaterial) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function createFreeMaterial(
  input: FreeMaterialFormInput,
): Promise<FreeMaterialActionResult<FreeMaterial>> {
  try {
    const supabase = await requireAdmin();
    const payload = sanitizeInput(input);
    const validationError = validatePayload(payload);

    if (validationError) {
      return { ok: false, error: validationError };
    }

    const { data: lastItem, error: lastError } = await supabase
      .from("free_materials")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastError) return { ok: false, error: lastError.message };

    const sort_order = (lastItem?.sort_order ?? -1) + 1;

    const { data, error } = await supabase
      .from("free_materials")
      .insert({ ...payload, sort_order })
      .select(FREE_MATERIAL_SELECT)
      .single();

    if (error) return { ok: false, error: error.message };

    revalidateFreeMaterialPaths();
    return { ok: true, data: mapFreeMaterial(data) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function updateFreeMaterial(
  id: string,
  input: FreeMaterialFormInput,
): Promise<FreeMaterialActionResult<FreeMaterial>> {
  try {
    const supabase = await requireAdmin();
    const payload = sanitizeInput(input);
    const validationError = validatePayload(payload);

    if (validationError) {
      return { ok: false, error: validationError };
    }

    const { data, error } = await supabase
      .from("free_materials")
      .update(payload)
      .eq("id", id)
      .select(FREE_MATERIAL_SELECT)
      .single();

    if (error) return { ok: false, error: error.message };

    revalidateFreeMaterialPaths();
    return { ok: true, data: mapFreeMaterial(data) };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function deleteFreeMaterial(
  id: string,
): Promise<FreeMaterialActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase
      .from("free_materials")
      .delete()
      .eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidateFreeMaterialPaths();
    return { ok: true };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

function mapFreeMaterialLink(row: Record<string, unknown>): FreeMaterialLink {
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

export async function listFreeMaterialLinks(): Promise<
  FreeMaterialActionResult<FreeMaterialLink[]>
> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("free_material_links")
      .select("*")
      .order("sort_order")
      .order("created_at", { ascending: false });

    if (error) return { ok: false, error: error.message };
    return {
      ok: true,
      data: (data ?? []).map((row) =>
        mapFreeMaterialLink(row as Record<string, unknown>),
      ),
    };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function createFreeMaterialLink(
  input: FreeMaterialLinkFormInput,
): Promise<FreeMaterialActionResult<FreeMaterialLink>> {
  try {
    const supabase = await requireAdmin();
    const values = await freeMaterialLinkSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { data: lastItem, error: lastError } = await supabase
      .from("free_material_links")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastError) return { ok: false, error: lastError.message };

    const sort_order = (lastItem?.sort_order ?? -1) + 1;

    const { data, error } = await supabase
      .from("free_material_links")
      .insert({
        title: values.title,
        url: values.url,
        description: values.description,
        published: values.published,
        sort_order,
      })
      .select("*")
      .single();

    if (error) return { ok: false, error: error.message };

    revalidateFreeMaterialPaths();
    return {
      ok: true,
      data: mapFreeMaterialLink(data as Record<string, unknown>),
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { ok: false, error: error.errors[0] ?? error.message };
    }
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function updateFreeMaterialLink(
  id: string,
  input: FreeMaterialLinkFormInput,
): Promise<FreeMaterialActionResult<FreeMaterialLink>> {
  try {
    const supabase = await requireAdmin();
    const values = await freeMaterialLinkSchema.validate(input, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { data, error } = await supabase
      .from("free_material_links")
      .update({
        title: values.title,
        url: values.url,
        description: values.description,
        published: values.published,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) return { ok: false, error: error.message };

    revalidateFreeMaterialPaths();
    return {
      ok: true,
      data: mapFreeMaterialLink(data as Record<string, unknown>),
    };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { ok: false, error: error.errors[0] ?? error.message };
    }
    return { ok: false, error: "Brak autoryzacji." };
  }
}

export async function deleteFreeMaterialLink(
  id: string,
): Promise<FreeMaterialActionResult> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase
      .from("free_material_links")
      .delete()
      .eq("id", id);

    if (error) return { ok: false, error: error.message };

    revalidateFreeMaterialPaths();
    return { ok: true };
  } catch {
    return { ok: false, error: "Brak autoryzacji." };
  }
}
