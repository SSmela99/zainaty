"use client";

import {
  CopyIcon,
  DownloadIcon,
  InfoIcon,
  RefreshCwIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  deleteR2File,
  getR2FileDownloadUrl,
  listR2Files,
  type R2FileItem,
} from "@/app/admin/actions/r2-files";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminLoading } from "@/components/admin/admin-loading";
import { adminSectionBodyClassName } from "@/components/admin/admin.utils";
import {
  AdminMessage,
  AdminPanelCard,
} from "@/components/admin/blog/blog-admin.shared";
import { adminInputClassName } from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadFileToR2 } from "@/lib/r2/upload.client";
import { cn } from "@/lib/utils";

import {
  formatFileDate,
  formatFileSize,
  getFileNameFromKey,
} from "./r2-files.utils";

const DEFAULT_PREFIX = "biblioteka";
const UPLOAD_ACCEPT = ".pdf,application/pdf,video/mp4,video/webm,video/quicktime,video/x-msvideo";

export function R2FilesManager() {
  const [files, setFiles] = useState<R2FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prefix, setPrefix] = useState(DEFAULT_PREFIX);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileToDelete, setFileToDelete] = useState<R2FileItem | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFiles = useCallback(async () => {
    setIsLoading(true);
    const result = await listR2Files();

    if (result.ok) {
      setFiles(result.data);
      setError(null);
    } else {
      setError(result.error ?? "Nie udało się wczytać plików.");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadFiles();
  }, [loadFiles]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    const result = await uploadFileToR2({
      file,
      prefix: prefix.trim() || DEFAULT_PREFIX,
      onProgress: setProgress,
    });

    setIsUploading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    toast.success("Plik wgrany do R2.");
    await loadFiles();
  }

  async function handleCopyKey(key: string) {
    try {
      await navigator.clipboard.writeText(key);
      toast.success("Klucz skopiowany.");
    } catch {
      toast.error("Nie udało się skopiować klucza.");
    }
  }

  async function handleDownload(key: string) {
    const result = await getR2FileDownloadUrl(key);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    window.open(result.data, "_blank", "noopener,noreferrer");
  }

  function confirmDelete() {
    if (!fileToDelete) return;

    const key = fileToDelete.key;
    setError(null);

    startTransition(async () => {
      const result = await deleteR2File(key);

      if (!result.ok) {
        setError(result.error ?? "Nie udało się usunąć pliku.");
        setFileToDelete(null);
        return;
      }

      setFileToDelete(null);
      toast.success("Plik usunięty z R2.");
      await loadFiles();
    });
  }

  return (
    <div className={adminSectionBodyClassName}>
      <AdminPanelCard>
        <h2 className="text-lg font-black tracking-[-0.02em]">Wgraj plik</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Plik trafia bezpośrednio do Cloudflare R2. Podaj folder (prefix), do
          którego ma trafić. Ten sam plik możesz potem przypisać do dowolnego
          kursu, wybierając go z biblioteki.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-2">
            <label
              htmlFor="r2-prefix"
              className="text-xs font-semibold text-zinc-600 dark:text-zinc-400"
            >
              Folder (prefix)
            </label>
            <Input
              id="r2-prefix"
              value={prefix}
              onChange={(event) => setPrefix(event.target.value)}
              placeholder="biblioteka"
              className={adminInputClassName(false)}
            />
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={UPLOAD_ACCEPT}
            className="hidden"
            disabled={isUploading}
            onChange={handleFileChange}
          />

          <Button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="h-11 bg-[#ff4b12] px-5 text-white hover:bg-[#e6430f] dark:bg-[#d7ff00] dark:text-black dark:hover:bg-[#c4eb00]"
          >
            <UploadIcon className="size-4" />
            {isUploading ? `Wgrywanie… ${progress}%` : "Wybierz i wgraj plik"}
          </Button>
        </div>

        {isUploading ? (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-[#ff4b12] transition-[width] duration-200 dark:bg-[#d7ff00]"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}

        <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
          Dozwolone formaty: PDF, MP4, WebM, MOV. Wgranie pliku o tej samej
          nazwie w tym samym folderze podmienia poprzednią wersję.
        </p>
      </AdminPanelCard>

      {error ? <AdminMessage error={error} /> : null}

      <AdminPanelCard>
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-black tracking-[-0.02em]">
            Pliki w R2
            {!isLoading ? (
              <span className="ml-2 text-sm font-medium text-zinc-500">
                ({files.length})
              </span>
            ) : null}
          </h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={() => void loadFiles()}
          >
            <RefreshCwIcon className={cn("size-4", isLoading && "animate-spin")} />
            Odśwież
          </Button>
        </div>

        <div className="mt-2 flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs leading-5 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          <InfoIcon className="mt-0.5 size-4 shrink-0" />
          <span>
            Plik można usunąć tylko wtedy, gdy nie jest przypisany do żadnego
            kursu. Jeśli plik jest używany, najpierw odłącz go od kursu w zakładce
            „Kursy”.
          </span>
        </div>

        {isLoading ? (
          <AdminLoading label="Wczytywanie plików..." />
        ) : files.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">
            Brak plików w buckecie. Wgraj pierwszy plik powyżej.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {files.map((file) => (
              <li
                key={file.key}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-100 p-4 dark:border-zinc-800 md:flex-row md:items-start md:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-zinc-950 dark:text-white">
                    {getFileNameFromKey(file.key)}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-zinc-500">
                    {file.key}
                  </p>
                  <p className="mt-2 text-xs text-zinc-500">
                    {formatFileSize(file.size)} · {formatFileDate(file.lastModified)}
                  </p>

                  {file.usedBy.length > 0 ? (
                    <div className="mt-2 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      <p>Używany przez:</p>
                      <ul className="mt-1 space-y-0.5">
                        {file.usedBy.map((usage) => (
                          <li key={usage.courseId} className="flex gap-1.5">
                            <span aria-hidden>•</span>
                            <span>{usage.courseTitle}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs font-medium text-zinc-400">
                      Nieużywany
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void handleCopyKey(file.key)}
                  >
                    <CopyIcon className="size-4" />
                    Kopiuj klucz
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void handleDownload(file.key)}
                  >
                    <DownloadIcon className="size-4" />
                    Podgląd
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={isPending || file.usedBy.length > 0}
                    title={
                      file.usedBy.length > 0
                        ? "Odłącz plik od kursu, aby móc go usunąć."
                        : undefined
                    }
                    onClick={() => setFileToDelete(file)}
                  >
                    <Trash2Icon className="size-4" />
                    Usuń
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </AdminPanelCard>

      <AdminConfirmDialog
        open={fileToDelete != null}
        onOpenChange={(open) => {
          if (!open && !isPending) setFileToDelete(null);
        }}
        title="Usunąć plik z R2?"
        description={
          fileToDelete
            ? `Czy na pewno chcesz trwale usunąć „${getFileNameFromKey(fileToDelete.key)}" z Cloudflare R2? Tej operacji nie można cofnąć.`
            : ""
        }
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
