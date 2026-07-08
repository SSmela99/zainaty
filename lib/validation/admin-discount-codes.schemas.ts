import * as yup from "yup";

import { DISCOUNT_TYPE } from "@/lib/discount-codes/types";

export type DiscountCodeFormValues = {
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  expires_at: string;
  max_uses: string;
  course_id: string;
  active: boolean;
};

export const discountCodeSchema: yup.ObjectSchema<DiscountCodeFormValues> = yup.object({
  code: yup
    .string()
    .trim()
    .uppercase()
    .matches(/^[A-Z0-9_-]+$/, "Kod może zawierać litery, cyfry, _ i -.")
    .min(3, "Kod musi mieć co najmniej 3 znaki.")
    .max(32, "Kod może mieć maksymalnie 32 znaki.")
    .required("Kod jest wymagany."),
  discount_type: yup
    .string()
    .oneOf([DISCOUNT_TYPE.PERCENT, DISCOUNT_TYPE.FIXED])
    .required(),
  discount_value: yup
    .number()
    .typeError("Podaj liczbę.")
    .positive("Wartość rabatu musi być większa od zera.")
    .when("discount_type", {
      is: DISCOUNT_TYPE.PERCENT,
      then: (schema) => schema.max(100, "Rabat procentowy nie może przekraczać 100%."),
    })
    .required(),
  expires_at: yup.string().default(""),
  max_uses: yup.string().default(""),
  course_id: yup.string().default(""),
  active: yup.boolean().default(true),
});
