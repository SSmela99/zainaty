"use client";

import { Input } from "@/components/ui/input";
import type { NewsletterSource } from "@/lib/newsletter/constants";

import { useNewsletterSubscribe } from "./use-newsletter-subscribe";

type NewsletterSubscribeFormProps = {
  source: NewsletterSource;
  placeholder: string;
  submitLabel: string;
  formClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  onSuccess?: () => void;
};

export function NewsletterSubscribeForm({
  source,
  placeholder,
  submitLabel,
  formClassName,
  inputClassName,
  buttonClassName,
  onSuccess,
}: NewsletterSubscribeFormProps) {
  const { subscribe, isSubmitting } = useNewsletterSubscribe(source);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "");
    const success = await subscribe(email);

    if (success) {
      form.reset();
      onSuccess?.();
    }
  }

  return (
    <form className={formClassName} onSubmit={handleSubmit}>
      <Input
        type="email"
        name="email"
        required
        disabled={isSubmitting}
        autoComplete="email"
        placeholder={placeholder}
        className={inputClassName}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={buttonClassName}
      >
        {isSubmitting ? "Zapisuję..." : submitLabel}
      </button>
    </form>
  );
}
