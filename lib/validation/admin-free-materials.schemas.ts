import * as yup from "yup";

import { isYouTubeUrl } from "@/lib/free-materials/types";

export type FreeMaterialTagFormValues = {
  name: string;
};

export const freeMaterialTagSchema: yup.ObjectSchema<FreeMaterialTagFormValues> =
  yup.object({
    name: yup.string().trim().required("Nazwa tagu jest wymagana."),
  });

export type FreeMaterialFormValues = {
  title: string;
  description: string;
  tag_id: string;
  cover_image_url: string | null;
  is_video: boolean;
  youtube_url: string | null;
  r2_object_key: string | null;
  file_name: string;
  published: boolean;
  show_in_news: boolean;
};

export const freeMaterialSchema: yup.ObjectSchema<FreeMaterialFormValues> =
  yup.object({
    title: yup.string().trim().required("Tytuł jest wymagany."),
    description: yup.string().trim().required("Opis jest wymagany."),
    tag_id: yup.string().trim().required("Wybierz tag."),
    cover_image_url: yup.string().nullable().default(null),
    is_video: yup.boolean().default(false),
    youtube_url: yup
      .string()
      .trim()
      .nullable()
      .default(null)
      .when("is_video", {
        is: true,
        then: (schema) =>
          schema
            .required("Link do YouTube jest wymagany.")
            .test(
              "youtube-url",
              "Podaj poprawny link YouTube (youtube.com lub youtu.be).",
              (value) => Boolean(value && isYouTubeUrl(value)),
            ),
        otherwise: (schema) => schema.transform(() => null).nullable(),
      }),
    r2_object_key: yup.string().trim().nullable().default(null),
    file_name: yup.string().trim().default(""),
    published: yup.boolean().default(true),
    show_in_news: yup.boolean().default(false),
  });

export type FreeMaterialLinkFormValues = {
  title: string;
  url: string;
  description: string;
  published: boolean;
};

export const freeMaterialLinkSchema: yup.ObjectSchema<FreeMaterialLinkFormValues> =
  yup.object({
    title: yup.string().trim().required("Tytuł jest wymagany."),
    url: yup
      .string()
      .trim()
      .required("Link jest wymagany.")
      .url("Podaj poprawny adres URL (z https://)."),
    description: yup
      .string()
      .trim()
      .required("Krótki opis jest wymagany.")
      .max(280, "Opis może mieć max 280 znaków."),
    published: yup.boolean().default(true),
  });
