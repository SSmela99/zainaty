import type { ReactNode } from "react";

type FloaterProps = {
  className: string;
  duration?: number;
  delay?: number;
  children: ReactNode;
};

export function Floater({
  className,
  duration = 5,
  delay = 0,
  children,
}: FloaterProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute animate-float will-change-transform ${className}`}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
