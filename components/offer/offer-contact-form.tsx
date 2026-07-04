"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { submitOfferContact } from "@/app/actions/offer-contact";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import {
  offerContactSchema,
  type OfferContactFormValues,
} from "@/lib/validation/offer-contact.schemas";
import { cn } from "@/lib/utils";

import { OfferContactSuccess } from "./offer-contact-success";
import {
  offerContactContent,
  offerContactFields,
} from "./offer-contact.utils";

const fieldClassName =
  "h-12 rounded-2xl border-0 bg-[#f2efe6] px-4 text-base shadow-none ring-0 focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-[#ff4b12]/25 md:text-base dark:bg-[#111111] dark:focus-visible:ring-[#d7ff00]/25";

const phoneInputClassName =
  "[&_button]:bg-[#f2efe6] [&_button]:shadow-none [&_button]:hover:bg-[#f2efe6] [&_button]:focus-visible:ring-2 [&_button]:focus-visible:ring-[#ff4b12]/25 dark:[&_button]:bg-[#111111] dark:[&_button]:hover:bg-[#111111] dark:[&_button]:focus-visible:ring-[#d7ff00]/25 [&_input]:bg-[#f2efe6] [&_input]:shadow-none [&_input]:focus-visible:ring-2 [&_input]:focus-visible:ring-[#ff4b12]/25 dark:[&_input]:bg-[#111111] dark:[&_input]:focus-visible:ring-[#d7ff00]/25";

const labelClassName = "text-sm font-bold text-zinc-950 dark:text-white";

const emptyForm: OfferContactFormValues = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export function OfferContactForm() {
  const [successEmail, setSuccessEmail] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<OfferContactFormValues>({
    resolver: yupResolver(offerContactSchema),
    defaultValues: emptyForm,
  });

  const message = watch("message");

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await submitOfferContact(values);

      if (!result.ok) {
        toast.error(result.error ?? "Nie udało się wysłać wiadomości.");
        return;
      }

      setSuccessEmail(values.email);
      reset(emptyForm);
    });
  });

  if (successEmail) {
    return <OfferContactSuccess email={successEmail} />;
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit} noValidate>
      {offerContactFields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id} className={labelClassName}>
            {field.label}
          </Label>
          <Input
            id={field.id}
            type={field.type}
            autoComplete={field.autoComplete}
            aria-invalid={Boolean(errors[field.name as keyof OfferContactFormValues])}
            className={cn(
              fieldClassName,
              errors[field.name as keyof OfferContactFormValues] &&
                "ring-2 ring-[#ff4b12]/40",
            )}
            {...register(field.name)}
          />
          {errors[field.name as keyof OfferContactFormValues] ? (
            <p className="text-sm font-medium text-[#ff4b12]">
              {errors[field.name as keyof OfferContactFormValues]?.message}
            </p>
          ) : null}
        </div>
      ))}

      <div className="space-y-2">
        <Label htmlFor="phone" className={labelClassName}>
          Telefon
        </Label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInput
              id="phone"
              value={field.value}
              onChange={field.onChange}
              defaultCountry="PL"
              international
              countryCallingCodeEditable={false}
              autoComplete="tel"
              placeholder="Numer telefonu"
              className={cn(
                phoneInputClassName,
                errors.phone && "ring-2 ring-[#ff4b12]/40",
              )}
            />
          )}
        />
        {errors.phone ? (
          <p className="text-sm font-medium text-[#ff4b12]">{errors.phone.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className={labelClassName}>
          Wiadomość
        </Label>
        <Textarea
          id="message"
          rows={5}
          maxLength={offerContactContent.maxMessageLength}
          aria-invalid={Boolean(errors.message)}
          className={cn(
            "min-h-36 resize-none rounded-2xl border-0 bg-[#f2efe6] px-4 py-3 text-base shadow-none ring-0 focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-[#ff4b12]/25 md:text-base dark:bg-[#111111] dark:focus-visible:ring-[#d7ff00]/25",
            errors.message && "ring-2 ring-[#ff4b12]/40",
          )}
          {...register("message")}
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          {offerContactContent.maxMessageHint}
          {message ? ` · ${message.length}/${offerContactContent.maxMessageLength}` : null}
        </p>
        {errors.message ? (
          <p className="text-sm font-medium text-[#ff4b12]">{errors.message.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="h-14 w-full cursor-pointer rounded-2xl bg-[#ff4b12] text-base font-black text-white transition-transform duration-300 ease-out hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 dark:bg-[#d7ff00] dark:text-zinc-950"
      >
        {isPending ? "Wysyłanie..." : offerContactContent.submitLabel}
      </button>
    </form>
  );
}
