import { OfferContactForm } from "./offer-contact-form";
import {
  OFFER_CONTACT_SECTION_ID,
  offerContactContent,
} from "./offer-contact.utils";

export function OfferContact() {
  return (
    <section
      id={OFFER_CONTACT_SECTION_ID}
      className="relative scroll-mt-[calc(4.5rem-200px)] py-20 md:py-28"
    >
      <div className="relative mx-auto max-w-250 px-8">
        <div className="text-center">
          <p className="text-[13px] font-bold tracking-[0.22em] text-[#1a4dff] uppercase">
            {offerContactContent.label}
          </p>
          <h2 className="mt-5 text-4xl leading-[1.08] font-black tracking-[-0.03em] text-zinc-950 md:text-5xl dark:text-white">
            {offerContactContent.title}{" "}
            <span className="text-[#ff4b12] dark:text-[#d7ff00]">
              {offerContactContent.titleAccent}
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
            {offerContactContent.description}
          </p>
        </div>

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm md:mt-12 md:p-12 dark:bg-[#1c1c1c] dark:shadow-none">
          <OfferContactForm />
        </div>
      </div>
    </section>
  );
}
