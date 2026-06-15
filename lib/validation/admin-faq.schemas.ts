import * as yup from "yup";

export type FaqItemFormValues = {
  question: string;
  answer: string;
  published: boolean;
};

export const faqItemSchema: yup.ObjectSchema<FaqItemFormValues> = yup.object({
  question: yup.string().trim().required("Pytanie jest wymagane."),
  answer: yup.string().trim().required("Odpowiedź jest wymagana."),
  published: yup.boolean().default(true),
});
