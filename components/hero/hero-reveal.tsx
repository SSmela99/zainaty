"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type HeroRevealProps = {
  children: ReactNode;
  className?: string;
};

export function HeroReveal({ children, className }: HeroRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={
        prefersReducedMotion ? false : { opacity: 0, y: 40 }
      }
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1.35,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
