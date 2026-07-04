export const COURSE_KINDS = ["training", "video", "package"] as const;

export type CourseKind = (typeof COURSE_KINDS)[number];

export const COURSE_KIND_LABELS: Record<CourseKind, string> = {
  training: "Szkolenia",
  video: "Szkolenia wideo",
  package: "Pakiety",
};

export const COURSE_KIND_SINGULAR: Record<CourseKind, string> = {
  training: "szkolenie",
  video: "szkolenie wideo",
  package: "pakiet",
};

export function getCourseFormatLabel(kind: CourseKind): string {
  switch (kind) {
    case "video":
      return "Szkolenie wideo";
    case "package":
      return "Pakiet szkoleń";
    default:
      return "E-book";
  }
}
