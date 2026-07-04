"use client";

import { useEffect, useState, useTransition } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import { createFaqItem, updateFaqItem } from "@/app/admin/actions/faq";
import {
  AdminFormField,
  adminInputClassName,
  adminTextareaClassName,
} from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FaqItem } from "@/lib/faq/types";
import {
  faqItemSchema,
  type FaqItemFormValues,
} from "@/lib/validation/admin-faq.schemas";

import { AdminMessage } from "@/components/admin/blog/blog-admin.shared";

type FaqItemFormProps = {
  item?: FaqItem | null;
  onSaved: (item: FaqItem) => void;
  onCancel: () => void;
};

const emptyForm: FaqItemFormValues = {
  question: "",
  answer: "",
  published: true,
};

export function FaqItemForm({ item, onSaved, onCancel }: FaqItemFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FaqItemFormValues>({
    resolver: yupResolver(faqItemSchema),
    defaultValues: emptyForm,
  });

  useEffect(() => {
    if (!item) {
      reset(emptyForm);
      return;
    }

    reset({
      question: item.question,
      answer: item.answer,
      published: item.published,
    });
  }, [item, reset]);

  const onSubmit = handleSubmit((values) => {
    setError(null);

    startTransition(async () => {
      const result = item
        ? await updateFaqItem(item.id, values)
        : await createFaqItem(values);

      if (!result.ok) {
        setError(result.error ?? "Operacja nie powiodła się.");
        return;
      }

      onSaved(result.data);
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <AdminFormField
        label="Pytanie"
        htmlFor="faq-question"
        error={errors.question?.message}
        required
      >
        <Input
          id="faq-question"
          placeholder="np. Czym jest ChatGPT?"
          aria-invalid={Boolean(errors.question)}
          className={adminInputClassName(Boolean(errors.question))}
          {...register("question")}
        />
      </AdminFormField>

      <AdminFormField
        label="Odpowiedź"
        htmlFor="faq-answer"
        error={errors.answer?.message}
        required
      >
        <Textarea
          id="faq-answer"
          rows={6}
          placeholder="Pełna odpowiedź na pytanie..."
          aria-invalid={Boolean(errors.answer)}
          className={adminTextareaClassName(Boolean(errors.answer))}
          {...register("answer")}
        />
      </AdminFormField>

      <Controller
        name="published"
        control={control}
        render={({ field }) => (
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            <input
              type="checkbox"
              checked={field.value}
              onChange={(event) => field.onChange(event.target.checked)}
              className="size-4 accent-[#ff4b12] dark:accent-[#d7ff00]"
            />
            Opublikowane
          </label>
        )}
      />

      <AdminMessage error={error} />

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={isPending}
          className="h-10 bg-[#ff4b12] px-5 text-white hover:bg-[#e6430f] dark:bg-[#d7ff00] dark:text-black dark:hover:bg-[#c4eb00]"
        >
          {item ? "Zapisz pytanie" : "Dodaj pytanie"}
        </Button>
        <Button type="button" variant="outline" disabled={isPending} onClick={onCancel}>
          Anuluj
        </Button>
      </div>
    </form>
  );
}
