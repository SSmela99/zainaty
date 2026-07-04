import type { CourseNavChild } from "@/lib/paths";
import { PATHS } from "@/lib/paths";

export const courseNavIconByHref = {
  [PATHS.COURSES_TRAININGS]: "book",
  [PATHS.COURSES_VIDEO]: "video",
  [PATHS.COURSES_PACKAGES]: "layers",
} as const satisfies Record<CourseNavChild["href"], "book" | "video" | "layers">;
