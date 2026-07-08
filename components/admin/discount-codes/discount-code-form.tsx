"use client";

import { useEffect, useState, useTransition } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";

import {
  createDiscountCode,
  updateDiscountCode,
} from "@/app/admin/actions/discount-codes";
import { listCourses } from "@/app/admin/actions/courses";
import { AdminMessage, AdminPanelCard } from "@/components/admin/blog/blog-admin.shared";
import {
  AdminFormField,
  AdminSelect,
  adminInputClassName,
} from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Course } from "@/lib/courses/types";
import type { DiscountCode } from "@/lib/discount-codes/types";
import { DISCOUNT_TYPE } from "@/lib/discount-codes/types";
import {
  discountCodeSchema,
  type DiscountCodeFormValues,
} from "@/lib/validation/admin-discount-codes.schemas";

type DiscountCodeFormProps = {
  item?: DiscountCode | null;
  onSaved: (item: DiscountCode) => void;
  onCancel: () => void;
};

const emptyForm: DiscountCodeFormValues = {
  code: "",
  discount_type: DISCOUNT_TYPE.PERCENT,
  discount_value: 10,
  expires_at: "",
  max_uses: "",
  course_id: "",
  active: true,
};

function toDatetimeLocalValue(value: string | null): string {
  if (!value) return "";

  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

function mapFormToInput(values: DiscountCodeFormValues) {
  return {
    code: values.code,
    discount_type: values.discount_type,
    discount_value: values.discount_value,
    expires_at: values.expires_at ? new Date(values.expires_at).toISOString() : null,
    max_uses: values.max_uses ? Number(values.max_uses) : null,
    course_id: values.course_id || null,
    active: values.active,
  };
}

export function DiscountCodeForm({ item, onSaved, onCancel }: DiscountCodeFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<DiscountCodeFormValues>({
    resolver: yupResolver(discountCodeSchema),
    defaultValues: emptyForm,
  });

  const discountType = watch("discount_type");

  useEffect(() => {
    void listCourses().then((result) => {
      if (result.ok) {
        setCourses(result.data);
      }
    });
  }, []);

  useEffect(() => {
    if (!item) {
      reset(emptyForm);
      return;
    }

    reset({
      code: item.code,
      discount_type: item.discount_type,
      discount_value: item.discount_value,
      expires_at: toDatetimeLocalValue(item.expires_at),
      max_uses: item.max_uses != null ? String(item.max_uses) : "",
      course_id: item.course_id ?? "",
      active: item.active,
    });
  }, [item, reset]);

  const onSubmit = handleSubmit((values) => {
    setError(null);
    const input = mapFormToInput(values);

    startTransition(async () => {
      const result = item
        ? await updateDiscountCode(item.id, input)
        : await createDiscountCode(input);

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
        label="Kod"
        htmlFor="discount-code"
        error={errors.code?.message}
        required
      >
        <Input
          id="discount-code"
          placeholder="np. WIOSNA20"
          aria-invalid={Boolean(errors.code)}
          className={adminInputClassName(Boolean(errors.code))}
          {...register("code")}
        />
      </AdminFormField>

      <div className="grid gap-5 md:grid-cols-2">
        <AdminFormField label="Typ rabatu" htmlFor="discount-type">
          <Controller
            name="discount_type"
            control={control}
            render={({ field }) => (
              <AdminSelect
                id="discount-type"
                value={field.value}
                onChange={field.onChange}
              >
                <option value={DISCOUNT_TYPE.PERCENT}>Procent (%)</option>
                <option value={DISCOUNT_TYPE.FIXED}>Kwota (zł)</option>
              </AdminSelect>
            )}
          />
        </AdminFormField>

        <AdminFormField
          label={discountType === DISCOUNT_TYPE.PERCENT ? "Rabat (%)" : "Rabat (zł)"}
          htmlFor="discount-value"
          error={errors.discount_value?.message}
          required
        >
          <Input
            id="discount-value"
            type="number"
            min={0}
            step={discountType === DISCOUNT_TYPE.PERCENT ? 1 : 0.01}
            aria-invalid={Boolean(errors.discount_value)}
            className={adminInputClassName(Boolean(errors.discount_value))}
            {...register("discount_value", { valueAsNumber: true })}
          />
        </AdminFormField>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <AdminFormField
          label="Wygasa (opcjonalnie)"
          htmlFor="discount-expires"
          error={errors.expires_at?.message}
        >
          <Input
            id="discount-expires"
            type="datetime-local"
            className={adminInputClassName(Boolean(errors.expires_at))}
            {...register("expires_at")}
          />
        </AdminFormField>

        <AdminFormField
          label="Limit użyć (opcjonalnie)"
          htmlFor="discount-max-uses"
          error={errors.max_uses?.message}
        >
          <Input
            id="discount-max-uses"
            type="number"
            min={1}
            step={1}
            placeholder="np. 100"
            className={adminInputClassName(Boolean(errors.max_uses))}
            {...register("max_uses")}
          />
        </AdminFormField>
      </div>

      <AdminFormField label="Kurs (opcjonalnie)" htmlFor="discount-course">
        <Controller
          name="course_id"
          control={control}
          render={({ field }) => (
            <AdminSelect
              id="discount-course"
              value={field.value}
              onChange={field.onChange}
            >
              <option value="">Wszystkie kursy</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </AdminSelect>
          )}
        />
      </AdminFormField>

      <Controller
        name="active"
        control={control}
        render={({ field }) => (
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            <input
              type="checkbox"
              checked={field.value}
              onChange={(event) => field.onChange(event.target.checked)}
              className="size-4 accent-[#ff4b12] dark:accent-[#d7ff00]"
            />
            Aktywny
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
          {item ? "Zapisz kod" : "Dodaj kod"}
        </Button>
        <Button type="button" variant="outline" disabled={isPending} onClick={onCancel}>
          Anuluj
        </Button>
      </div>
    </form>
  );
}
