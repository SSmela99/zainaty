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
  partitionR2Files,
} from "./r2-files.utils";

type UploadKind = "pdf" | "video";

const UPLOAD_CONFIG: Record<
  UploadKind,
  { title: string; description: string; defaultPrefix: string; accept: string; formats: string }
> = {
  pdf: {
    title: "Wgraj PDF",
    description:
      "Materiały do szkoleń (e-booki, workbooki). Przypiszesz je później do kursów typu „szkolenie”.",
    defaultPrefix: "dokumenty",
    accept: ".pdf,application/pdf",
    formats: "PDF",
  },
  video: {
    title: "Wgraj wideo",
    description:
      "Lekcje wideo do kursów. Przypiszesz je w programie kursu lub z listy biblioteki.",
    defaultPrefix: "videos",
    accept: "video/mp4,video/webm,video/quicktime,video/x-msvideo",
    formats: "MP4, WebM, MOV",
  },
};

type R2FileRowProps = {
  file: R2FileItem;
  isPending: boolean;
  onCopyKey: (key: string) => void;
  onDownload: (key: string) => void;
  onDelete: (file: R2FileItem) => void;
};

function R2FileRow({
  file,
  isPending,
  onCopyKey,
  onDownload,
  onDelete,
}: R2FileRowProps) {
  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-zinc-100 p-4 dark:border-zinc-800 md:flex-row md:items-start md:justify-between">
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-zinc-950 dark:text-white">
          {getFileNameFromKey(file.key)}
        </p>
        <p className="mt-0.5 truncate text-xs text-zinc-500">{file.key}</p>
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
          <p className="mt-2 text-xs font-medium text-zinc-400">Nieużywany</p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => void onCopyKey(file.key)}>
          <CopyIcon className="size-4" />
          Kopiuj klucz
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => void onDownload(file.key)}>
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
          onClick={() => onDelete(file)}
        >
          <Trash2Icon className="size-4" />
          Usuń
        </Button>
      </div>
    </li>
  );
}

type R2UploadPanelProps = {
  kind: UploadKind;
  prefix: string;
  onPrefixChange: (value: string) => void;
  isUploading: boolean;
  progress: number;
  onUpload: (file: File) => void;
};

function R2UploadPanel({
  kind,
  prefix,
  onPrefixChange,
  isUploading,
  progress,
  onUpload,
}: R2UploadPanelProps) {
  const config = UPLOAD_CONFIG[kind];
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <AdminPanelCard>
      <h2 className="text-lg font-black tracking-[-0.02em]">{config.title}</h2>
      <p className="mt-1 text-sm text-zinc-500">{config.description}</p>

      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-2">
          <label
            htmlFor={`r2-prefix-${kind}`}
            className="text-xs font-semibold text-zinc-600 dark:text-zinc-400"
          >
            Folder (prefix)
          </label>
          <Input
            id={`r2-prefix-${kind}`}
            value={prefix}
            onChange={(event) => onPrefixChange(event.target.value)}
            placeholder={config.defaultPrefix}
            className={adminInputClassName(false)}
          />
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={config.accept}
          className="hidden"
          disabled={isUploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) onUpload(file);
          }}
        />

        <Button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="h-11 bg-[#f24a00] px-5 text-white hover:bg-[#d94200] dark:bg-[#daff02] dark:text-black dark:hover:bg-[#9bec00]"
        >
          <UploadIcon className="size-4" />
          {isUploading ? `Wgrywanie… ${progress}%` : "Wybierz i wgraj plik"}
        </Button>
      </div>

      {isUploading ? (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full rounded-full bg-[#f24a00] transition-[width] duration-200 dark:bg-[#daff02]"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}

      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
        Dozwolone formaty: {config.formats}.
      </p>
    </AdminPanelCard>
  );
}

type R2FileListPanelProps = {
  title: string;
  files: R2FileItem[];
  emptyLabel: string;
  isLoading: boolean;
  isPending: boolean;
  onRefresh: () => void;
  onCopyKey: (key: string) => void;
  onDownload: (key: string) => void;
  onDelete: (file: R2FileItem) => void;
};

function R2FileListPanel({
  title,
  files,
  emptyLabel,
  isLoading,
  isPending,
  onRefresh,
  onCopyKey,
  onDownload,
  onDelete,
}: R2FileListPanelProps) {
  return (
    <AdminPanelCard>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black tracking-[-0.02em]">
          {title}
          {!isLoading ? (
            <span className="ml-2 text-sm font-medium text-zinc-500">({files.length})</span>
          ) : null}
        </h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={onRefresh}
        >
          <RefreshCwIcon className={cn("size-4", isLoading && "animate-spin")} />
          Odśwież
        </Button>
      </div>

      {isLoading ? (
        <AdminLoading label="Wczytywanie plików..." />
      ) : files.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-500">{emptyLabel}</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {files.map((file) => (
            <R2FileRow
              key={file.key}
              file={file}
              isPending={isPending}
              onCopyKey={onCopyKey}
              onDownload={onDownload}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </AdminPanelCard>
  );
}

export function R2FilesManager() {
  const [files, setFiles] = useState<R2FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfPrefix, setPdfPrefix] = useState(UPLOAD_CONFIG.pdf.defaultPrefix);
  const [videoPrefix, setVideoPrefix] = useState(UPLOAD_CONFIG.video.defaultPrefix);
  const [uploadingKind, setUploadingKind] = useState<UploadKind | null>(null);
  const [progress, setProgress] = useState(0);
  const [fileToDelete, setFileToDelete] = useState<R2FileItem | null>(null);
  const [isPending, startTransition] = useTransition();

  const { pdfFiles, videoFiles, otherFiles } = partitionR2Files(files);

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

  async function handleUpload(kind: UploadKind, file: File) {
    setUploadingKind(kind);
    setProgress(0);

    const prefix =
      (kind === "pdf" ? pdfPrefix : videoPrefix).trim() ||
      UPLOAD_CONFIG[kind].defaultPrefix;

    const result = await uploadFileToR2({
      file,
      prefix,
      onProgress: setProgress,
    });

    setUploadingKind(null);

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
      <div className="grid gap-6 lg:grid-cols-2">
        <R2UploadPanel
          kind="pdf"
          prefix={pdfPrefix}
          onPrefixChange={setPdfPrefix}
          isUploading={uploadingKind === "pdf"}
          progress={progress}
          onUpload={(file) => void handleUpload("pdf", file)}
        />
        <R2UploadPanel
          kind="video"
          prefix={videoPrefix}
          onPrefixChange={setVideoPrefix}
          isUploading={uploadingKind === "video"}
          progress={progress}
          onUpload={(file) => void handleUpload("video", file)}
        />
      </div>

      {error ? <AdminMessage error={error} /> : null}

      <div className="flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs leading-5 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
        <InfoIcon className="mt-0.5 size-4 shrink-0" />
        <span>
          Plik można usunąć tylko wtedy, gdy nie jest przypisany do żadnego kursu.
          PDF-y służą szkoleniom, wideo — kursom wideo.
        </span>
      </div>

      <R2FileListPanel
        title="Pliki PDF"
        files={pdfFiles}
        emptyLabel="Brak plików PDF w buckecie."
        isLoading={isLoading}
        isPending={isPending}
        onRefresh={() => void loadFiles()}
        onCopyKey={(key) => void handleCopyKey(key)}
        onDownload={(key) => void handleDownload(key)}
        onDelete={setFileToDelete}
      />

      <R2FileListPanel
        title="Pliki wideo"
        files={videoFiles}
        emptyLabel="Brak plików wideo w buckecie."
        isLoading={isLoading}
        isPending={isPending}
        onRefresh={() => void loadFiles()}
        onCopyKey={(key) => void handleCopyKey(key)}
        onDownload={(key) => void handleDownload(key)}
        onDelete={setFileToDelete}
      />

      {otherFiles.length > 0 ? (
        <R2FileListPanel
          title="Inne pliki"
          files={otherFiles}
          emptyLabel=""
          isLoading={isLoading}
          isPending={isPending}
          onRefresh={() => void loadFiles()}
          onCopyKey={(key) => void handleCopyKey(key)}
          onDownload={(key) => void handleDownload(key)}
          onDelete={setFileToDelete}
        />
      ) : null}

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
