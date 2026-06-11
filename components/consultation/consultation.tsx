"use client";

import { AsteriskIcon, CalendarIcon } from "lucide-react";

import { handleConsultationRedirect } from "@/lib/consultation";

import { consultationContent } from "./consultation.utils";

export function Consultation() {
  return (
    <section className="relative overflow-hidden bg-[#ebe3d4] py-16 dark:bg-[#0a0a0a] md:py-24">
      <AsteriskIcon
        strokeWidth={1.5}
        aria-hidden="true"
        className="pointer-events-none absolute top-8 right-8 size-20 text-[#7c3aed]/25 md:top-12 md:right-16 md:size-28 dark:text-[#a78bfa]/25"
      />

      <svg
        viewBox="0 0 90 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 left-8 h-5 w-28 text-[#ffb088] md:bottom-12 md:left-16 dark:text-[#9ea015]/60"
      >
        <path d="M2 9 Q 11 0 20 9 T 38 9 T 56 9 T 74 9 T 88 9" />
      </svg>

      <div className="relative mx-auto max-w-410 px-8">
        <div className="flex flex-col items-start gap-10 rounded-3xl bg-white p-8 shadow-sm md:p-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16 dark:bg-[#1c1c1c] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] justify-self-center max-w-300">
          <div className="max-w-xl">
            <p className="text-[13px] font-bold tracking-[0.22em] text-[#7c3aed] uppercase dark:text-[#a78bfa]">
              {consultationContent.label}
            </p>

            <h2 className="mt-4 text-3xl leading-[1.1] font-black tracking-[-0.02em] text-zinc-950 md:text-4xl dark:text-white">
              {consultationContent.heading}
              <br />
              <span className="text-[#ff4b12] dark:text-[#d7ff00]">
                {consultationContent.headingAccent}
              </span>
            </h2>

            <p className="mt-5 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {consultationContent.description}
            </p>
          </div>

          <div className="flex w-full shrink-0 flex-col items-center lg:w-auto lg:items-end">
            <button
              type="button"
              onClick={handleConsultationRedirect}
              className="inline-flex h-12 cursor-pointer items-center gap-2.5 rounded-xl bg-[#ff4b12] px-7 text-sm font-black text-white transition-transform hover:-translate-y-0.5 hover:scale-105 dark:bg-[#d7ff00] dark:text-zinc-950"
            >
              <CalendarIcon strokeWidth={2.2} className="size-4" />
              {consultationContent.cta.label}
            </button>

            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-500 self-center">
              {consultationContent.meta}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
