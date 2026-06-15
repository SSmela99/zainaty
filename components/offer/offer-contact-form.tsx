"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";

import {
  offerContactContent,
  offerContactFields,
} from "./offer-contact.utils";

const fieldClassName =
  "h-12 rounded-2xl border-0 bg-[#f2efe6] px-4 text-base shadow-none ring-0 focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-[#ff4b12]/25 md:text-base dark:bg-[#111111] dark:focus-visible:ring-[#d7ff00]/25";

const phoneInputClassName =
  "[&_button]:bg-[#f2efe6] [&_button]:shadow-none [&_button]:hover:bg-[#f2efe6] [&_button]:focus-visible:ring-2 [&_button]:focus-visible:ring-[#ff4b12]/25 dark:[&_button]:bg-[#111111] dark:[&_button]:hover:bg-[#111111] dark:[&_button]:focus-visible:ring-[#d7ff00]/25 [&_input]:bg-[#f2efe6] [&_input]:shadow-none [&_input]:focus-visible:ring-2 [&_input]:focus-visible:ring-[#ff4b12]/25 dark:[&_input]:bg-[#111111] dark:[&_input]:focus-visible:ring-[#d7ff00]/25";

const labelClassName = "text-sm font-bold text-zinc-950 dark:text-white";

export function OfferContactForm() {
  const [phone, setPhone] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      {offerContactFields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id} className={labelClassName}>
            {field.label}
          </Label>
          <Input
            id={field.id}
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            className={fieldClassName}
          />
        </div>
      ))}

      <div className="space-y-2">
        <Label htmlFor="phone" className={labelClassName}>
          Telefon
        </Label>
        <PhoneInput
          id="phone"
          name="phone"
          value={phone}
          onChange={setPhone}
          defaultCountry="PL"
          international
          countryCallingCodeEditable={false}
          autoComplete="tel"
          placeholder="Numer telefonu"
          className={phoneInputClassName}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className={labelClassName}>
          Wiadomość
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          maxLength={offerContactContent.maxMessageLength}
          className={`min-h-36 resize-none rounded-2xl border-0 bg-[#f2efe6] px-4 py-3 text-base shadow-none ring-0 focus-visible:border-0 focus-visible:ring-2 focus-visible:ring-[#ff4b12]/25 md:text-base dark:bg-[#111111] dark:focus-visible:ring-[#d7ff00]/25`}
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-500">
          {offerContactContent.maxMessageHint}
        </p>
      </div>

      <button
        type="submit"
        className="h-14 w-full cursor-pointer rounded-2xl bg-[#ff4b12] text-base font-black text-white transition-transform duration-300 ease-out hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100 dark:bg-[#d7ff00] dark:text-zinc-950"
      >
        {offerContactContent.submitLabel}
      </button>
    </form>
  );
}
