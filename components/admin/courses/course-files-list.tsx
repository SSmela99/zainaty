"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { listR2Files, type R2FileItem } from "@/app/admin/actions/r2-files";
import { isPdfR2Key, isVideoR2Key } from "@/components/admin/r2-files/r2-files.utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CourseKind } from "@/lib/courses/kinds";
import type { CourseFileFormValues } from "@/lib/validation/admin-courses.schemas";
import { cn } from "@/lib/utils";

import { R2FileUploader } from "./r2-file-uploader";

function matchesKind(key: string, isVideoCourse: boolean): boolean {
  return isVideoCourse ? isVideoR2Key(key) : isPdfR2Key(key);
}

type CourseFilesListProps = {
  values: CourseFileFormValues[];
  onChange: (values: CourseFileFormValues[]) => void;
  error?: string;
  courseSlug: string;
  courseKind: CourseKind;
};

function createEmptyFile(courseKind: CourseKind): CourseFileFormValues {
  return {
    file_type: courseKind === "video" ? "video" : "pdf",
    title: "",
    r2_object_key: "",
  };
}

export function CourseFilesList({
  values,
  onChange,
  error,
  courseSlug,
  courseKind,
}: CourseFilesListProps) {
  const isVideoCourse = courseKind === "video";
  const [libraryFiles, setLibraryFiles] = useState<R2FileItem[]>([]);

  useEffect(() => {
    let active = true;

    void listR2Files().then((result) => {
      if (active && result.ok) {
        setLibraryFiles(result.data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const libraryOptions = useMemo(
    () => libraryFiles.filter((file) => matchesKind(file.key, isVideoCourse)),
    [libraryFiles, isVideoCourse],
  );

  function updateItem(index: number, patch: Partial<CourseFileFormValues>) {
    const next = [...values];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  }

  function removeItem(index: number) {
    onChange(values.filter((_, itemIndex) => itemIndex !== index));
  }

  function addItem() {
    onChange([...values, createEmptyFile(courseKind)]);
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold tracking-[-0.01em] text-zinc-800 dark:text-zinc-100">
          {isVideoCourse ? "Pliki wideo (Cloudflare R2)" : "Pliki kursu (Cloudflare R2)"}
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {isVideoCourse
            ? "Wgraj wideo bezpośrednio do R2 lub wpisz klucz istniejącego obiektu. Po zakupie użytkownik ma stały dostęp — link do pobrania jest generowany na żądanie."
            : "Wgraj plik bezpośrednio do R2 lub wpisz klucz istniejącego obiektu, np. courses/slug/ebook.pdf. Po zakupie użytkownik ma stały dostęp."}
        </p>
      </div>

      <div className="space-y-3">
        {values.map((file, index) => (
          <div
            key={`course-file-${index}`}
            className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700"
          >
            <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-start">
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    Nazwa
                  </label>
                  <Input
                    value={file.title}
                    onChange={(event) =>
                      updateItem(index, { title: event.target.value })
                    }
                    placeholder={
                      isVideoCourse ? "np. Lekcja 1 — Wprowadzenie" : "np. E-book AI"
                    }
                    className={cn(
                      "h-11 rounded-xl border bg-white px-3.5 text-sm dark:bg-[#151414]",
                      error
                        ? "border-red-500 dark:border-red-500"
                        : "border-zinc-200 dark:border-zinc-700",
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    {isVideoCourse ? "Wgraj plik wideo" : "Wgraj plik"}
                  </label>
                  <R2FileUploader
                    courseSlug={courseSlug}
                    kind={courseKind}
                    onUploaded={(objectKey, filename) => {
                      updateItem(index, {
                        r2_object_key: objectKey,
                        file_type: isVideoCourse ? "video" : file.file_type,
                        title:
                          file.title.trim() || filename.replace(/\.[^.]+$/, ""),
                      });
                    }}
                  />
                </div>

                {libraryOptions.length > 0 ? (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                      Wybierz z biblioteki
                    </label>
                    <select
                      value={
                        libraryOptions.some(
                          (option) => option.key === file.r2_object_key,
                        )
                          ? file.r2_object_key
                          : ""
                      }
                      onChange={(event) => {
                        const key = event.target.value;
                        if (!key) return;

                        const filename = key.split("/").pop() ?? key;
                        updateItem(index, {
                          r2_object_key: key,
                          file_type: isVideoCourse ? "video" : file.file_type,
                          title:
                            file.title.trim() || filename.replace(/\.[^.]+$/, ""),
                        });
                      }}
                      className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3.5 text-sm dark:border-zinc-700 dark:bg-[#151414]"
                    >
                      <option value="">— wybierz plik z R2 —</option>
                      {libraryOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                          {option.key}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    Klucz R2
                  </label>
                  <Input
                    value={file.r2_object_key}
                    onChange={(event) =>
                      updateItem(index, { r2_object_key: event.target.value })
                    }
                    placeholder={
                      isVideoCourse
                        ? "videos/slug/lekcja.mp4"
                        : "courses/slug/plik.pdf"
                    }
                    className={cn(
                      "h-11 rounded-xl border bg-white px-3.5 text-sm dark:bg-[#151414]",
                      error
                        ? "border-red-500 dark:border-red-500"
                        : "border-zinc-200 dark:border-zinc-700",
                    )}
                  />
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Uzupełni się automatycznie po wgraniu pliku, po wybraniu z
                    biblioteki lub wpisz ręcznie istniejący klucz.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeItem(index)}
                aria-label="Usuń plik"
                className="size-11 shrink-0 rounded-xl md:self-end"
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addItem}
        className="h-10 rounded-xl"
      >
        <PlusIcon />
        {isVideoCourse ? "Dodaj wideo" : "Dodaj plik"}
      </Button>

      {error ? (
        <p
          className="text-xs font-medium text-red-500 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
