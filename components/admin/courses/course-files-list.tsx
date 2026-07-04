"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";

import { AdminSelect } from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CourseKind } from "@/lib/courses/kinds";
import type { CourseFileFormValues } from "@/lib/validation/admin-courses.schemas";
import { cn } from "@/lib/utils";

import { R2VideoUploader } from "./r2-video-uploader";

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
            ? "Wgraj wideo bezpośrednio do R2. Po zakupie użytkownik ma stały dostęp — link do pobrania jest generowany na żądanie."
            : "Wpisz klucz obiektu z R2, np. courses/slug/ebook.pdf. Po zakupie użytkownik ma stały dostęp."}
        </p>
      </div>

      <div className="space-y-3">
        {values.map((file, index) => (
          <div
            key={`course-file-${index}`}
            className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-700"
          >
            <div
              className={cn(
                "grid gap-3",
                isVideoCourse
                  ? "md:grid-cols-[1fr_auto]"
                  : "md:grid-cols-[140px_1fr_1fr_auto] md:items-end",
              )}
            >
              {!isVideoCourse ? (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                    Typ
                  </label>
                  <AdminSelect
                    value={file.file_type}
                    onChange={(event) =>
                      updateItem(index, {
                        file_type: event.target
                          .value as CourseFileFormValues["file_type"],
                      })
                    }
                  >
                    <option value="pdf">PDF</option>
                    <option value="video">Wideo</option>
                  </AdminSelect>
                </div>
              ) : null}

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
                      "h-11 rounded-xl border bg-white px-3.5 text-sm dark:bg-[#141414]",
                      error
                        ? "border-red-500 dark:border-red-500"
                        : "border-zinc-200 dark:border-zinc-700",
                    )}
                  />
                </div>

                {isVideoCourse ? (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                      Plik wideo
                    </label>
                    <R2VideoUploader
                      courseSlug={courseSlug}
                      kind={courseKind}
                      onUploaded={(objectKey, filename) => {
                        updateItem(index, {
                          r2_object_key: objectKey,
                          file_type: "video",
                          title: file.title.trim() || filename.replace(/\.[^.]+$/, ""),
                        });
                      }}
                    />
                    {file.r2_object_key ? (
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Wgrano:{" "}
                        <code className="rounded bg-zinc-100 px-1 py-0.5 dark:bg-zinc-800">
                          {file.r2_object_key}
                        </code>
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                      Klucz R2
                    </label>
                    <Input
                      value={file.r2_object_key}
                      onChange={(event) =>
                        updateItem(index, { r2_object_key: event.target.value })
                      }
                      placeholder="courses/slug/plik.pdf"
                      className={cn(
                        "h-11 rounded-xl border bg-white px-3.5 text-sm dark:bg-[#141414]",
                        error
                          ? "border-red-500 dark:border-red-500"
                          : "border-zinc-200 dark:border-zinc-700",
                      )}
                    />
                  </div>
                )}
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
