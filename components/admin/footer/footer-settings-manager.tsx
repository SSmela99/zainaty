"use client";

import { useEffect, useState, useTransition } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  getFooterSettingsAdmin,
  updateFooterSettings,
} from "@/app/admin/actions/footer";
import { AdminLoading } from "@/components/admin/admin-loading";
import { AdminMessage, AdminPanelCard } from "@/components/admin/blog/blog-admin.shared";
import {
  AdminFormField,
  adminInputClassName,
  adminTextareaClassName,
} from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_FOOTER_SETTINGS } from "@/lib/footer/defaults";
import {
  footerSettingsSchema,
  type FooterSettingsFormValues,
} from "@/lib/validation/admin-footer.schemas";

const socialFields = [
  { id: "social_facebook", label: "Facebook" },
  { id: "social_instagram", label: "Instagram" },
  { id: "social_linkedin", label: "LinkedIn" },
  { id: "social_youtube", label: "YouTube" },
] as const satisfies readonly {
  id: keyof Pick<
    FooterSettingsFormValues,
    "social_facebook" | "social_instagram" | "social_linkedin" | "social_youtube"
  >;
  label: string;
}[];

const contactFields = [
  { id: "contact_line_1", label: "Wiersz 1", hint: "np. ulica" },
  { id: "contact_line_2", label: "Wiersz 2", hint: "np. miasto" },
  { id: "contact_line_3", label: "Wiersz 3", hint: "np. telefon" },
  { id: "contact_line_4", label: "Wiersz 4", hint: "np. e-mail" },
] as const satisfies readonly {
  id: keyof Pick<
    FooterSettingsFormValues,
    "contact_line_1" | "contact_line_2" | "contact_line_3" | "contact_line_4"
  >;
  label: string;
  hint: string;
}[];

export function FooterSettingsManager() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FooterSettingsFormValues>({
    resolver: yupResolver(footerSettingsSchema),
    defaultValues: DEFAULT_FOOTER_SETTINGS,
  });

  useEffect(() => {
    async function loadSettings() {
      setIsLoading(true);
      const result = await getFooterSettingsAdmin();

      if (result.ok && result.data) {
        reset({
          description: result.data.description,
          social_facebook: result.data.social_facebook,
          social_instagram: result.data.social_instagram,
          social_linkedin: result.data.social_linkedin,
          social_youtube: result.data.social_youtube,
          contact_line_1: result.data.contact_line_1,
          contact_line_2: result.data.contact_line_2,
          contact_line_3: result.data.contact_line_3,
          contact_line_4: result.data.contact_line_4,
        });
        setError(null);
      } else {
        setError(result.error ?? "Nie udało się wczytać ustawień stopki.");
      }

      setIsLoading(false);
    }

    void loadSettings();
  }, [reset]);

  const onSubmit = handleSubmit((values) => {
    setError(null);

    startTransition(async () => {
      const result = await updateFooterSettings(values);

      if (!result.ok || !result.data) {
        setError(result.error ?? "Nie udało się zapisać ustawień stopki.");
        return;
      }

      reset({
        description: result.data.description,
        social_facebook: result.data.social_facebook,
        social_instagram: result.data.social_instagram,
        social_linkedin: result.data.social_linkedin,
        social_youtube: result.data.social_youtube,
        contact_line_1: result.data.contact_line_1,
        contact_line_2: result.data.contact_line_2,
        contact_line_3: result.data.contact_line_3,
        contact_line_4: result.data.contact_line_4,
      });

      toast.success("Stopka została zaktualizowana.");
    });
  });

  if (isLoading) {
    return (
      <div className="mt-10">
        <AdminPanelCard>
          <AdminLoading label="Wczytywanie ustawień stopki..." />
        </AdminPanelCard>
      </div>
    );
  }

  return (
    <form className="mt-10 space-y-6" onSubmit={onSubmit}>
      {error ? <AdminMessage error={error} /> : null}

      <AdminPanelCard>
        <h2 className="text-lg font-black tracking-[-0.02em]">Opis marki</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Krótki tekst pod logo w lewej kolumnie stopki.
        </p>

        <div className="mt-6">
          <AdminFormField
            label="Opis"
            htmlFor="description"
            required
            error={errors.description?.message}
          >
            <Textarea
              id="description"
              rows={4}
              className={adminTextareaClassName(Boolean(errors.description))}
              {...register("description")}
            />
          </AdminFormField>
        </div>
      </AdminPanelCard>

      <AdminPanelCard>
        <h2 className="text-lg font-black tracking-[-0.02em]">Social media</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Linki do profili. Puste pola ukryją ikonę w stopce.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {socialFields.map((field) => (
            <AdminFormField
              key={field.id}
              label={field.label}
              htmlFor={field.id}
              error={errors[field.id]?.message}
            >
              <Input
                id={field.id}
                type="url"
                placeholder="https://"
                className={adminInputClassName(Boolean(errors[field.id]))}
                {...register(field.id)}
              />
            </AdminFormField>
          ))}
        </div>
      </AdminPanelCard>

      <AdminPanelCard>
        <h2 className="text-lg font-black tracking-[-0.02em]">Kontakt</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Cztery wiersze wyświetlane w sekcji kontaktowej stopki.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {contactFields.map((field) => (
            <AdminFormField
              key={field.id}
              label={field.label}
              htmlFor={field.id}
              hint={field.hint}
              error={errors[field.id]?.message}
            >
              <Input
                id={field.id}
                className={adminInputClassName(Boolean(errors[field.id]))}
                {...register(field.id)}
              />
            </AdminFormField>
          ))}
        </div>
      </AdminPanelCard>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending || !isDirty}
          className="h-10 bg-[#ff4b12] px-6 text-white hover:bg-[#e6430f] disabled:opacity-50 dark:bg-[#d7ff00] dark:text-black dark:hover:bg-[#c4eb00]"
        >
          {isPending ? "Zapisywanie..." : "Zapisz stopkę"}
        </Button>
      </div>
    </form>
  );
}
