import * as yup from "yup";

export type TestimonialFormValues = {
  author_name: string;
  author_role: string;
  content: string;
  rating: number;
  avatar_url: string | null;
  published: boolean;
};

export const testimonialSchema: yup.ObjectSchema<TestimonialFormValues> = yup.object({
  author_name: yup.string().trim().required("Imię i nazwisko są wymagane."),
  author_role: yup.string().trim().required("Rola / zawód są wymagane."),
  content: yup.string().trim().required("Treść opinii jest wymagana."),
  rating: yup
    .number()
    .typeError("Podaj ocenę od 1 do 5.")
    .integer("Ocena musi być liczbą całkowitą.")
    .min(1, "Minimalna ocena to 1.")
    .max(5, "Maksymalna ocena to 5.")
    .required("Ocena jest wymagana."),
  avatar_url: yup.string().nullable().default(null),
  published: yup.boolean().default(true),
});
