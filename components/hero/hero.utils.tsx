import type { ReactNode } from "react";
import { AsteriskIcon } from "lucide-react";

type HeroDecoration = {
  id: string;
  className: string;
  duration: number;
  delay: number;
  icon: ReactNode;
};

/** Pozycje względem zewnętrznego kontenera hero — bliżej środka / kolumny tekstu. */
export const heroDecorations: HeroDecoration[] = [
  {
    id: "asterisk",
    className:
      "top-6 right-[8%] hidden md:top-10 md:right-[12%] md:block lg:right-[16%]",
    duration: 6,
    delay: 0,
    icon: (
      <AsteriskIcon
        strokeWidth={1.5}
        className="size-24 text-zinc-300 lg:size-28 dark:text-zinc-700"
      />
    ),
  },
  {
    id: "blue-dot",
    className: "top-10 left-[28%] md:top-14 md:left-[32%]",
    duration: 4.5,
    delay: 0.2,
    icon: <span className="block size-2.5 rounded-full bg-[#0033ff]" />,
  },
  {
    id: "purple-dot",
    className:
      "top-[22%] left-[10%] hidden sm:block md:top-[24%] md:left-[14%] lg:left-[18%]",
    duration: 5.2,
    delay: 0.6,
    icon: <span className="block size-2.5 rounded-full bg-purple-500" />,
  },
  {
    id: "zigzag",
    className:
      "top-[28%] right-[8%] hidden md:top-[30%] md:right-[12%] md:block lg:right-[16%]",
    duration: 5.5,
    delay: 0.4,
    icon: (
      <svg
        viewBox="0 0 60 30"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-16 text-[#3355ff] lg:h-9 lg:w-20 dark:text-[#0033ff]"
      >
        <path d="M2 22 L 12 6 L 22 22 L 32 6 L 42 22 L 52 6" />
      </svg>
    ),
  },
  {
    id: "orange-dot",
    className:
      "right-[12%] bottom-[30%] hidden md:right-[16%] md:bottom-[28%] md:block lg:right-[20%]",
    duration: 4.8,
    delay: 1,
    icon: <span className="block size-2.5 rounded-full bg-[#f24a00]" />,
  },
  {
    id: "squiggle",
    className:
      "bottom-16 left-[10%] hidden md:bottom-20 md:left-[14%] md:block lg:left-[18%]",
    duration: 6.2,
    delay: 0.8,
    icon: (
      <svg
        viewBox="0 0 90 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="h-4 w-24 text-[#ff9a70] lg:h-5 lg:w-28 dark:text-[#7a9e00]"
      >
        <path d="M2 9 Q 11 0 20 9 T 38 9 T 56 9 T 74 9 T 88 9" />
      </svg>
    ),
  },
  {
    id: "tree",
    className:
      "right-[8%] bottom-14 hidden md:right-[12%] md:bottom-16 md:block lg:right-[16%]",
    duration: 5.6,
    delay: 0.3,
    icon: (
      <svg
        viewBox="0 0 60 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="size-14 text-purple-400 lg:size-16 dark:text-purple-500"
      >
        <path d="M10 56 Q 15 34 12 14 Q 10 5 14 4" />
        <path d="M22 56 Q 27 34 24 14 Q 22 5 26 4" />
        <path d="M34 56 Q 39 34 36 14 Q 34 5 38 4" />
        <path d="M46 56 Q 51 34 48 14 Q 46 5 50 4" />
      </svg>
    ),
  },
];
