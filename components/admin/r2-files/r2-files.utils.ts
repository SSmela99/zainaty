export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, exponent);

  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function formatFileDate(isoDate: string | null): string {
  if (!isoDate) return "-";

  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

export function getFileNameFromKey(key: string): string {
  const parts = key.split("/");
  return parts[parts.length - 1] || key;
}

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".avi"] as const;

export function isVideoR2Key(key: string): boolean {
  const lower = key.toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export function isPdfR2Key(key: string): boolean {
  return key.toLowerCase().endsWith(".pdf");
}

export function partitionR2Files<T extends { key: string }>(files: T[]) {
  const pdfFiles: T[] = [];
  const videoFiles: T[] = [];
  const otherFiles: T[] = [];

  for (const file of files) {
    if (isPdfR2Key(file.key)) {
      pdfFiles.push(file);
    } else if (isVideoR2Key(file.key)) {
      videoFiles.push(file);
    } else {
      otherFiles.push(file);
    }
  }

  return { pdfFiles, videoFiles, otherFiles };
}
