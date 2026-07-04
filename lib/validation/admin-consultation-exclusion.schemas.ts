import * as yup from "yup";

import { consultationTimeSlots } from "@/lib/consultations/calendar";

export type ConsultationExclusionFormValues = {
  exclusionDate: string;
  wholeDay: boolean;
  times: string[];
};

export const consultationExclusionSchema: yup.ObjectSchema<ConsultationExclusionFormValues> =
  yup.object({
    exclusionDate: yup.string().required("Wybierz datę."),
    wholeDay: yup.boolean().default(false),
    times: yup
      .array()
      .of(yup.string().oneOf([...consultationTimeSlots]).required())
      .default([])
      .when("wholeDay", {
        is: false,
        then: (schema) =>
          schema.min(1, "Wybierz co najmniej jedną godzinę do wykluczenia."),
        otherwise: (schema) => schema.max(0),
      }),
  });
