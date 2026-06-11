import type { ReactNode } from "react";
import { AsteriskIcon } from "lucide-react";

type HeroDecoration = {
  id: string;
  className: string;
  duration: number;
  delay: number;
  icon: ReactNode;
};

export const heroDecorations: HeroDecoration[] = [
  {
    id: "asterisk",
    className: "-top-10 -right-4 hidden md:block",
    duration: 6,
    delay: 0,
    icon: (
      <AsteriskIcon
        strokeWidth={1.5}
        className="size-32 text-zinc-300 dark:text-zinc-700"
      />
    ),
  },
  {
    id: "blue-dot",
    className: "-top-4 left-[40%]",
    duration: 4.5,
    delay: 0.2,
    icon: <span className="block size-2.5 rounded-full bg-[#1a4dff]" />,
  },
  {
    id: "purple-dot",
    className: "top-20 left-[6%]",
    duration: 5.2,
    delay: 0.6,
    icon: <span className="block size-2.5 rounded-full bg-purple-500" />,
  },
  {
    id: "zigzag",
    className: "top-[42%] -right-12 hidden md:block",
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
        className="h-9 w-20 text-[#3b6dff] dark:text-[#1a4dff]"
      >
        <path d="M2 22 L 12 6 L 22 22 L 32 6 L 42 22 L 52 6" />
      </svg>
    ),
  },
  {
    id: "orange-dot",
    className: "top-[70%] -right-4 hidden md:block",
    duration: 4.8,
    delay: 1,
    icon: <span className="block size-2.5 rounded-full bg-[#ff4b12]" />,
  },
  {
    id: "squiggle",
    className: "-bottom-2 -left-16 hidden md:block",
    duration: 6.2,
    delay: 0.8,
    icon: (
      <svg
        viewBox="0 0 90 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="h-5 w-28 text-[#ffb088] dark:text-[#9ea015]"
      >
        <path d="M2 9 Q 11 0 20 9 T 38 9 T 56 9 T 74 9 T 88 9" />
      </svg>
    ),
  },
  {
    id: "tree",
    className: "-bottom-2 -right-12 hidden md:block",
    duration: 5.6,
    delay: 0.3,
    icon: (
      <svg
        viewBox="0 0 60 60"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="size-20 text-purple-400 dark:text-purple-500"
      >
        <path d="M10 56 Q 15 34 12 14 Q 10 5 14 4" />
        <path d="M22 56 Q 27 34 24 14 Q 22 5 26 4" />
        <path d="M34 56 Q 39 34 36 14 Q 34 5 38 4" />
        <path d="M46 56 Q 51 34 48 14 Q 46 5 50 4" />
      </svg>
    ),
  },
];
