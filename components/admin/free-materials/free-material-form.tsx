"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { FileIcon, ImageIcon, Trash2Icon } from "lucide-react";

import { listR2Files, type R2FileItem } from "@/app/admin/actions/r2-files";
import {
  createFreeMaterial,
  updateFreeMaterial,
} from "@/app/admin/actions/free-materials";
import {
  AdminFormField,
  AdminSelect,
  adminInputClassName,
  adminTextareaClassName,
} from "@/components/admin/forms";
import { AdminMessage } from "@/components/admin/blog/blog-admin.shared";
import { getFileNameFromKey } from "@/components/admin/r2-files/r2-files.utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FREE_MATERIAL_COVERS_BUCKET,
  FREE_MATERIAL_FILE_ACCEPT,
  FREE_MATERIAL_FILE_HINT,
  FREE_MATERIALS_R2_PREFIX,
  IMAGE_UPLOAD_HINT,
  isFreeMaterialDocumentKey,
  validateImageFile,
} from "@/lib/free-materials/storage";
import type { FreeMaterial, FreeMaterialTag } from "@/lib/free-materials/types";
import { uploadFileToR2 } from "@/lib/r2/upload.client";
import { uploadImageToStorage } from "@/lib/supabase/upload-image.client";
import {
  freeMaterialSchema,
  type FreeMaterialFormValues,
} from "@/lib/validation/admin-free-materials.schemas";

type FreeMaterialFormProps = {
  item?: FreeMaterial | null;
  tags: FreeMaterialTag[];
  onSaved: (item: FreeMaterial) => void;
  onCancel: () => void;
};

const emptyForm: FreeMaterialFormValues = {
  title: "",
  description: "",
  tag_id: "",
  cover_image_url: null,
  is_video: false,
  youtube_url: null,
  r2_object_key: null,
  file_name: "",
  published: true,
  show_in_news: false,
};

export function FreeMaterialForm({
  item,
  tags,
  onSaved,
  onCancel,
}: FreeMaterialFormProps) {
  const coverInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [libraryFiles, setLibraryFiles] = useState<R2FileItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FreeMaterialFormValues>({
    resolver: yupResolver(freeMaterialSchema),
    defaultValues: emptyForm,
  });

  const coverUrl = watch("cover_image_url");
  const fileName = watch("file_name");
  const objectKey = watch("r2_object_key");
  const isVideo = watch("is_video");

  const libraryOptions = useMemo(
    () => libraryFiles.filter((file) => isFreeMaterialDocumentKey(file.key)),
    [libraryFiles],
  );

  useEffect(() => {
    void listR2Files().then((result) => {
      if (result.ok) {
        setLibraryFiles(result.data);
      }
    });
  }, []);

  useEffect(() => {
    if (!item) {
      reset(emptyForm);
      setCoverFile(null);
      setMaterialFile(null);
      setCoverError(null);
      setFileError(null);
      return;
    }

    reset({
      title: item.title,
      description: item.description,
      tag_id: item.tag_id ?? "",
      cover_image_url: item.cover_image_url,
      is_video: item.is_video,
      youtube_url: item.youtube_url,
      r2_object_key: item.r2_object_key,
      file_name: item.file_name,
      published: item.published,
      show_in_news: item.show_in_news,
    });
    setCoverFile(null);
    setMaterialFile(null);
    setCoverError(null);
    setFileError(null);
  }, [item, reset]);

  useEffect(() => {
    if (coverFile) {
      const objectUrl = URL.createObjectURL(coverFile);
      setCoverPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setCoverPreview(coverUrl);
  }, [coverFile, coverUrl]);

  const onSubmit = handleSubmit((values) => {
    setError(null);
    setCoverError(null);
    setFileError(null);

    if (!values.is_video) {
      const hasExistingFile =
        Boolean(values.r2_object_key) && values.r2_object_key !== "pending";
      if (!item && !materialFile && !hasExistingFile) {
        setFileError("Dodaj plik do pobrania.");
        return;
      }
      if (item && !materialFile && !hasExistingFile) {
        setFileError("Dodaj plik do pobrania.");
        return;
      }
    }

    startTransition(async () => {
      let nextCoverUrl = values.cover_image_url;
      let nextObjectKey = values.is_video ? null : values.r2_object_key;
      let nextFileName = values.is_video ? "" : values.file_name;

      if (coverFile) {
        const uploadResult = await uploadImageToStorage(
          FREE_MATERIAL_COVERS_BUCKET,
          coverFile,
        );

        if (!uploadResult.ok) {
          setCoverError(uploadResult.error);
          return;
        }

        nextCoverUrl = uploadResult.url;
      }

      if (!values.is_video && materialFile) {
        setUploadProgress(0);
        const uploadResult = await uploadFileToR2({
          file: materialFile,
          prefix: FREE_MATERIALS_R2_PREFIX,
          onProgress: setUploadProgress,
        });
        setUploadProgress(null);

        if (!uploadResult.ok) {
          setFileError(uploadResult.error);
          return;
        }

        nextObjectKey = uploadResult.objectKey;
        nextFileName = materialFile.name;
      }

      if (!values.is_video && (!nextObjectKey || nextObjectKey === "pending")) {
        setFileError("Plik do pobrania jest wymagany.");
        return;
      }

      const payload = {
        ...values,
        cover_image_url: nextCoverUrl,
        youtube_url: values.is_video ? values.youtube_url : null,
        r2_object_key: values.is_video ? null : nextObjectKey,
        file_name: values.is_video
          ? ""
          : nextFileName || materialFile?.name || "",
      };

      const result = item
        ? await updateFreeMaterial(item.id, payload)
        : await createFreeMaterial(payload);

      if (!result.ok) {
        setError(result.error ?? "Operacja nie powiodła się.");
        return;
      }

      onSaved(result.data);
    });
  });

  function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setCoverError(null);

    if (!file) {
      setCoverFile(null);
      return;
    }

    const validation = validateImageFile(file);
    if (!validation.ok) {
      event.target.value = "";
      setCoverFile(null);
      setCoverError(validation.error);
      return;
    }

    setCoverFile(file);
  }

  function removeCover() {
    setCoverFile(null);
    setCoverError(null);
    setValue("cover_image_url", null, { shouldDirty: true });
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFileError(null);

    if (!file) {
      setMaterialFile(null);
      return;
    }

    setMaterialFile(file);
    setValue("file_name", file.name, { shouldDirty: true, shouldValidate: true });
    setValue("r2_object_key", "pending", {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function handleLibrarySelect(key: string) {
    setFileError(null);
    setMaterialFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (!key) {
      return;
    }

    const filename = getFileNameFromKey(key);
    setValue("r2_object_key", key, { shouldDirty: true, shouldValidate: true });
    setValue("file_name", filename, { shouldDirty: true, shouldValidate: true });
  }

  function removeFile() {
    setMaterialFile(null);
    setFileError(null);
    setValue("r2_object_key", null, { shouldDirty: true, shouldValidate: true });
    setValue("file_name", "", { shouldDirty: true, shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleTypeChange(nextIsVideo: boolean) {
    setValue("is_video", nextIsVideo, { shouldDirty: true, shouldValidate: true });
    setFileError(null);

    if (nextIsVideo) {
      setMaterialFile(null);
      setValue("r2_object_key", null, { shouldDirty: true });
      setValue("file_name", "", { shouldDirty: true });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      setValue("youtube_url", null, { shouldDirty: true, shouldValidate: true });
    }
  }

  const hasCover = Boolean(coverPreview);
  const displayFileName = materialFile?.name || fileName;

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <AdminFormField label="Typ materiału" htmlFor="free-material-type">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            id="free-material-type"
            onClick={() => handleTypeChange(false)}
            className={
              !isVideo
                ? "h-10 cursor-pointer rounded-xl bg-[#f24a00] px-4 text-sm font-black text-white dark:bg-[#daff02] dark:text-zinc-950"
                : "h-10 cursor-pointer rounded-xl border border-[#ddd8ce] bg-transparent px-4 text-sm font-black text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
            }
          >
            Plik do pobrania
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange(true)}
            className={
              isVideo
                ? "h-10 cursor-pointer rounded-xl bg-[#f24a00] px-4 text-sm font-black text-white dark:bg-[#daff02] dark:text-zinc-950"
                : "h-10 cursor-pointer rounded-xl border border-[#ddd8ce] bg-transparent px-4 text-sm font-black text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
            }
          >
            Wideo (YouTube)
          </button>
        </div>
      </AdminFormField>

      <AdminFormField
        label="Tytuł"
        htmlFor="free-material-title"
        error={errors.title?.message}
        required
      >
        <Input
          id="free-material-title"
          placeholder="np. Checklist: pierwsze kroki z ChatGPT"
          aria-invalid={Boolean(errors.title)}
          className={adminInputClassName(Boolean(errors.title))}
          {...register("title")}
        />
      </AdminFormField>

      <AdminFormField
        label="Opis"
        htmlFor="free-material-description"
        error={errors.description?.message}
        required
      >
        <Textarea
          id="free-material-description"
          rows={4}
          placeholder="Krótki opis materiału..."
          aria-invalid={Boolean(errors.description)}
          className={adminTextareaClassName(Boolean(errors.description))}
          {...register("description")}
        />
      </AdminFormField>

      <AdminFormField
        label="Tag"
        htmlFor="free-material-tag"
        error={errors.tag_id?.message}
        required
        hint={
          tags.length === 0
            ? "Najpierw dodaj tagi w zakładce Tagi."
            : "Wybierz jeden tag z listy."
        }
      >
        <AdminSelect
          id="free-material-tag"
          aria-invalid={Boolean(errors.tag_id)}
          hasError={Boolean(errors.tag_id)}
          disabled={tags.length === 0}
          {...register("tag_id")}
        >
          <option value="">Wybierz tag…</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </AdminSelect>
      </AdminFormField>

      <AdminFormField
        label="Zdjęcie / okładka"
        htmlFor="free-material-cover"
        error={coverError ?? undefined}
        hint={`Opcjonalnie. ${IMAGE_UPLOAD_HINT}`}
      >
        <div className="flex flex-wrap items-center gap-5">
          {hasCover ? (
            <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border-2 border-[#f24a00] dark:border-[#daff02]">
              <Image
                src={coverPreview!}
                alt="Podgląd okładki"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-[#f24a00]/30 bg-[#ffd0bc] text-[#f24a00] dark:border-[#daff02]/40 dark:bg-[#3a4500] dark:text-[#daff02]">
              <ImageIcon className="size-6" />
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <input
              ref={coverInputRef}
              id="free-material-cover"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />

            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-xl"
              onClick={() => coverInputRef.current?.click()}
            >
              <ImageIcon className="size-4" />
              {hasCover ? "Zmień zdjęcie" : "Dodaj zdjęcie"}
            </Button>

            {hasCover ? (
              <Button
                type="button"
                variant="outline"
                className="h-10 rounded-xl"
                onClick={removeCover}
              >
                <Trash2Icon className="size-4" />
                Usuń zdjęcie
              </Button>
            ) : null}
          </div>
        </div>
      </AdminFormField>

      {isVideo ? (
        <AdminFormField
          label="Link YouTube"
          htmlFor="free-material-youtube"
          error={errors.youtube_url?.message}
          required
          hint="Np. https://www.youtube.com/watch?v=… lub https://youtu.be/…"
        >
          <Input
            id="free-material-youtube"
            type="url"
            placeholder="https://www.youtube.com/watch?v=…"
            aria-invalid={Boolean(errors.youtube_url)}
            className={adminInputClassName(Boolean(errors.youtube_url))}
            {...register("youtube_url")}
          />
        </AdminFormField>
      ) : (
        <AdminFormField
          label="Plik do pobrania"
          htmlFor="free-material-file"
          error={
            fileError ??
            errors.r2_object_key?.message ??
            errors.file_name?.message
          }
          required={!item}
          hint={FREE_MATERIAL_FILE_HINT}
        >
          <div className="space-y-4">
            {displayFileName || objectKey ? (
              <div className="flex items-center gap-3 rounded-xl border border-[#ddd8ce] bg-[#f5f2e9] px-4 py-3 text-sm dark:border-zinc-700 dark:bg-[#151414]">
                <FileIcon className="size-4 shrink-0 text-[#f24a00] dark:text-[#daff02]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-zinc-800 dark:text-zinc-100">
                    {displayFileName || getFileNameFromKey(objectKey ?? "")}
                  </p>
                  {objectKey && objectKey !== "pending" ? (
                    <p className="truncate text-xs text-zinc-500">{objectKey}</p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {libraryOptions.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  Wybierz z biblioteki R2
                </p>
                <AdminSelect
                  value={
                    libraryOptions.some((option) => option.key === objectKey)
                      ? (objectKey ?? "")
                      : ""
                  }
                  onChange={(event) => handleLibrarySelect(event.target.value)}
                >
                  <option value="">- wybierz plik z R2 -</option>
                  {libraryOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.key}
                    </option>
                  ))}
                </AdminSelect>
              </div>
            ) : null}

            <div className="space-y-2">
              <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Albo wgraj nowy plik
              </p>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={fileInputRef}
                  id="free-material-file"
                  type="file"
                  accept={FREE_MATERIAL_FILE_ACCEPT}
                  className="hidden"
                  onChange={handleFileChange}
                />

                <Button
                  type="button"
                  variant="outline"
                  className="h-10 rounded-xl"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileIcon className="size-4" />
                  {displayFileName || objectKey ? "Wgraj inny plik" : "Dodaj plik"}
                </Button>

                {materialFile || objectKey ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-xl"
                    onClick={removeFile}
                  >
                    <Trash2Icon className="size-4" />
                    Wyczyść wybór
                  </Button>
                ) : null}
              </div>

              {uploadProgress != null ? (
                <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-[#f24a00] transition-[width] duration-200 dark:bg-[#daff02]"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </AdminFormField>
      )}

      <Controller
        name="published"
        control={control}
        render={({ field }) => (
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            <input
              type="checkbox"
              checked={field.value}
              onChange={(event) => field.onChange(event.target.checked)}
              className="size-4 accent-[#f24a00] dark:accent-[#daff02]"
            />
            Opublikowany na stronie
          </label>
        )}
      />

      <Controller
        name="show_in_news"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
              <input
                type="checkbox"
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
                className="size-4 accent-[#f24a00] dark:accent-[#daff02]"
              />
              Dodaj do nowości
            </label>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Materiał pojawi się w sliderze „Nowości” na stronie głównej.
            </p>
          </div>
        )}
      />

      <AdminMessage error={error} />

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 bg-[#f24a00] px-5 text-white hover:bg-[#d94200] dark:bg-[#daff02] dark:text-black dark:hover:bg-[#9bec00]"
        >
          {item ? "Zapisz materiał" : "Dodaj materiał"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onCancel}
        >
          Anuluj
        </Button>
      </div>
    </form>
  );
}
