import * as yup from "yup";

export type PackageFormValues = {
  title: string;
  slug: string;
  cover_image_url: string | null;
  description: string;
  description_secondary: string;
  price: number;
  discount_price: number | null;
  published: boolean;
  course_ids: string[];
};

export const packageSchema: yup.ObjectSchema<PackageFormValues> = yup.object({
  title: yup.string().trim().required("Nazwa pakietu jest wymagana."),
  slug: yup.string().trim().required("Slug jest wymagany."),
  cover_image_url: yup.string().nullable().default(null),
  description: yup.string().trim().required("Opis 1 jest wymagany."),
  description_secondary: yup.string().trim().default(""),
  price: yup
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
    .default(null)
    .min(0, "Cena po rabacie nie może być ujemna.")
    .test(
      "discount-not-higher",
      "Cena po rabacie nie może być wyższa od ceny podstawowej.",
      function validateDiscount(value) {
        if (value == null) return true;
        const { price } = this.parent as PackageFormValues;
        return value <= price;
      },
    ),
  published: yup.boolean().default(false),
  course_ids: yup
    .array()
    .of(yup.string().required())
    .default([])
    .min(1, "Wybierz co najmniej jeden kurs wchodzący w skład pakietu."),
});
