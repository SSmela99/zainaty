import * as yup from "yup";

import { COURSE_KINDS, type CourseKind } from "@/lib/courses/kinds";
import type { CourseFileType } from "@/lib/courses/types";
import { isYoutubeUrl } from "@/lib/youtube/parse";
export type CourseFileFormValues = {
  file_type: CourseFileType;
  title: string;
  r2_object_key: string;
};

export type CourseFormValues = {
  kind: CourseKind;
  title: string;
  slug: string;
  description: string;
  demo_youtube_url: string | null;
  cover_image_url: string | null;
  price: number;
  discount_price: number | null;
  target_audience: string;
  learning_points: string[];
  outcomes: string[];
  duration_label: string;
  format_label: string;
  published: boolean;
  is_featured: boolean;
  files: CourseFileFormValues[];
};

function normalizeStringList(value: string[] | undefined): string[] {
  return (value ?? []).map((item) => item.trim()).filter(Boolean);
}

const courseFileSchema: yup.ObjectSchema<CourseFileFormValues> = yup.object({
  file_type: yup
    .mixed<CourseFileType>()
    .oneOf(["pdf", "video"])
    .required(),
  title: yup.string().trim().required("Podaj nazwę pliku."),
  r2_object_key: yup
    .string()
    .trim()
    .required("Podaj klucz obiektu R2.")
    .matches(
      /^[a-zA-Z0-9/_\-.]+$/,
      "Klucz R2 może zawierać tylko litery, cyfry, /, -, _ i .",
    ),
});

export const courseSchema: yup.ObjectSchema<CourseFormValues> = yup.object({
  kind: yup
    .mixed<CourseKind>()
    .oneOf([...COURSE_KINDS])
    .required(),
  title: yup.string().trim().required("Nazwa kursu jest wymagana."),
  slug: yup.string().trim().required("Slug jest wymagany."),
  description: yup.string().trim().required("Opis kursu jest wymagany."),
  demo_youtube_url: yup
    .string()
    .trim()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .default(null)
    .test(
      "youtube-url",
      "Podaj poprawny link do YouTube (np. https://www.youtube.com/watch?v=...).",
      (value) => !value || isYoutubeUrl(value),
    ),
  cover_image_url: yup.string().nullable().default(null),  price: yup
    .number()
    .typeError("Podaj poprawną cenę.")
    .min(0, "Cena nie może być ujemna.")
    .required("Cena jest wymagana."),
  discount_price: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue == null ? null : value,
    )
    .nullable()
    .min(0, "Cena po rabacie nie może być ujemna.")
    .test(
      "discount-not-higher",
      "Cena po rabacie nie może być wyższa od ceny podstawowej.",
      function validateDiscount(value) {
        if (value == null) return true;
        const { price } = this.parent as CourseFormValues;
        return value <= price;
      },
    ),
  target_audience: yup
    .string()
    .trim()
    .required("Opis grupy docelowej jest wymagany."),
  learning_points: yup
    .array()
    .of(yup.string().trim().required())
    .transform((value) => normalizeStringList(value))
    .default([])
    .min(1, "Dodaj co najmniej jeden punkt w sekcji „Czego się nauczysz”."),
  outcomes: yup
    .array()
    .of(yup.string().trim().required())
    .transform((value) => normalizeStringList(value))
    .default([])
    .min(
      1,
      "Dodaj co najmniej jeden punkt w sekcji „Co będziesz umieć po ukończeniu”.",
    ),
  duration_label: yup
    .string()
    .trim()
    .required("Podaj czas trwania kursu."),
  format_label: yup.string().trim().default("E-book"),
  published: yup.boolean().default(false),
  is_featured: yup.boolean().default(false),
  files: yup
    .array()
    .of(courseFileSchema)
    .default([])
    .min(1, "Dodaj co najmniej jeden plik (PDF lub wideo) z kluczem R2."),
});
