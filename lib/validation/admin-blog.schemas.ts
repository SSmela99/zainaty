import * as yup from "yup";

export type AuthorFormValues = {
  first_name: string;
  last_name: string;
  position: string;
  description: string;
  photo_url: string | null;
};

export const authorSchema: yup.ObjectSchema<AuthorFormValues> = yup.object({
  first_name: yup.string().trim().required("Imię jest wymagane."),
  last_name: yup.string().trim().required("Nazwisko jest wymagane."),
  position: yup.string().trim().required("Stanowisko jest wymagane."),
  description: yup.string().trim().required("Opis jest wymagany."),
  photo_url: yup.string().nullable().default(null),
});

export type TagFormValues = {
  name: string;
};

export const tagSchema: yup.ObjectSchema<TagFormValues> = yup.object({
  name: yup.string().trim().required("Nazwa tagu jest wymagana."),
});

export type BlogPostFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content_html: string;
  cover_image_url: string | null;
  author_id: string | null;
  tag_ids: string[];
  related_post_ids: string[];
  reading_time_minutes: number;
  published: boolean;
  show_in_news: boolean;
};

export const blogPostSchema: yup.ObjectSchema<BlogPostFormValues> = yup.object({
  title: yup.string().trim().required("Tytuł jest wymagany."),
  slug: yup.string().trim().required("Slug jest wymagany."),
  excerpt: yup.string().trim().required("Krótki opis jest wymagany."),
  content_html: yup.string().trim().required("Treść jest wymagana."),
  cover_image_url: yup
    .string()
    .nullable()
    .default(null)
    .test(
      "cover-required",
      "Główne zdjęcie jest wymagane.",
      (value) => Boolean(value),
    ),
  author_id: yup
    .string()
    .nullable()
    .required("Wybierz autora.")
    .test("author-selected", "Wybierz autora.", (value) => Boolean(value)),
  tag_ids: yup
    .array()
    .of(yup.string().required())
    .min(1, "Wybierz co najmniej jeden tag.")
    .default([]),
  related_post_ids: yup.array().of(yup.string().required()).default([]),
  reading_time_minutes: yup
    .number()
    .typeError("Podaj liczbę minut.")
    .integer("Czas czytania musi być liczbą całkowitą.")
    .min(1, "Minimum 1 minuta.")
    .required("Czas czytania jest wymagany."),
  published: yup.boolean().default(false),
  show_in_news: yup.boolean().default(false),
});
