import { CheckIcon } from "lucide-react";

type OfferContactSuccessProps = {
  email: string;
};

export function OfferContactSuccess({ email }: OfferContactSuccessProps) {
  return (
    <div className="px-2 py-8 text-center md:py-10">
      <div className="relative mx-auto flex size-20 items-center justify-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-[#f24a00]/15 blur-md dark:bg-[#daff02]/20"
        />
        <span className="relative flex size-16 items-center justify-center rounded-full bg-[#ffdccf] dark:bg-[#3a4500]">
          <CheckIcon
            className="size-8 text-[#f24a00] dark:text-[#daff02]"
            strokeWidth={2.5}
          />
        </span>
      </div>

      <h3 className="mt-8 text-3xl leading-tight font-black tracking-[0.02em] text-zinc-950 md:text-4xl dark:text-white">
        Gotowe! Dziękujemy
      </h3>

      <p className="mt-5 text-base leading-7 text-zinc-600 dark:text-zinc-400">
        Otrzymaliśmy Twoją wiadomość i odezwiemy się wkrótce.
      </p>

      <p className="mt-4 text-sm leading-6 text-zinc-500 md:text-base dark:text-zinc-400">
        Odpowiemy na adres{" "}
        <span className="font-bold text-zinc-950 dark:text-white">{email}</span>.
      </p>
    </div>
  );
}
