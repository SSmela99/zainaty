"use client";

import { useState } from "react";
import { toast } from "sonner";

import type { NewsletterSource } from "@/lib/newsletter/constants";

type SubscribeResponse = {
  success?: boolean;
  error?: string;
};

export function useNewsletterSubscribe(source: NewsletterSource) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function subscribe(email: string) {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      const data = (await response.json()) as SubscribeResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Nie udało się zapisać do newslettera.");
      }

      toast.success("Dziękujemy za zapisanie się do newslettera.");
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nie udało się zapisać do newslettera.",
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return { subscribe, isSubmitting };
}
