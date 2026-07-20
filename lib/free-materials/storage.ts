export const FREE_MATERIAL_COVERS_BUCKET = "free-material-covers";
export const FREE_MATERIALS_R2_PREFIX = "darmowe-materialy";

export const FREE_MATERIAL_FILE_ACCEPT =
  ".pdf,.zip,.doc,.docx,.xls,.xlsx,application/pdf,application/zip,application/x-zip-compressed,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const FREE_MATERIAL_FILE_HINT =
  "Dozwolone formaty: PDF, ZIP, DOC, DOCX, XLS, XLSX. Możesz wybrać plik z biblioteki R2 albo wgrać nowy.";

const FREE_MATERIAL_DOCUMENT_EXTENSIONS = [
  ".pdf",
  ".zip",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
] as const;

export function isFreeMaterialDocumentKey(key: string): boolean {
  const lower = key.toLowerCase();
  return FREE_MATERIAL_DOCUMENT_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export {
  IMAGE_UPLOAD_HINT,
  MAX_IMAGE_SIZE_LABEL,
  validateImageFile,
} from "@/lib/blog/storage";
