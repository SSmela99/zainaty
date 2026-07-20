"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  /** Ustaw `0`, gdy wewnątrz są elementy z własnym `transform` (np. slider). */
  y?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 1.35,
  y = 40,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={
        prefersReducedMotion ? false : { opacity: 0, ...(y === 0 ? {} : { y }) }
      }
      whileInView={{ opacity: 1, ...(y === 0 ? {} : { y: 0 }) }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -12% 0px" }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
