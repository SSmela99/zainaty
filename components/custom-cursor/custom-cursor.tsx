"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import {
  CUSTOM_CURSOR_HTML_CLASS,
  findHoverableElement,
  isOverCursorInvertSurface,
  shouldUseCustomCursor,
} from "./custom-cursor.utils";

type CursorState = {
  x: number;
  y: number;
  visible: boolean;
  hovering: boolean;
  overTextField: boolean;
  invertOnAccent: boolean;
};

const INITIAL_STATE: CursorState = {
  x: -100,
  y: -100,
  visible: false,
  hovering: false,
  overTextField: false,
  invertOnAccent: false,
};

export function CustomCursor() {
  const [isActive, setIsActive] = useState(false);
  const [state, setState] = useState<CursorState>(INITIAL_STATE);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (!shouldUseCustomCursor()) {
      return;
    }

    setIsActive(true);
    document.documentElement.classList.add(CUSTOM_CURSOR_HTML_CLASS);

    const tick = () => {
      const ease = 0.22;
      currentRef.current.x +=
        (targetRef.current.x - currentRef.current.x) * ease;
      currentRef.current.y +=
        (targetRef.current.y - currentRef.current.y) * ease;

      setState((prev) => ({
        ...prev,
        x: currentRef.current.x,
        y: currentRef.current.y,
      }));

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    const handlePointerMove = (event: PointerEvent) => {
      targetRef.current = { x: event.clientX, y: event.clientY };

      const overTextField =
        event.target instanceof Element &&
        Boolean(event.target.closest("input, textarea, [contenteditable='true']"));

      const hoverable = findHoverableElement(event.target);
      const invertOnAccent = isOverCursorInvertSurface(event.target);

      setState((prev) => ({
        ...prev,
        visible: true,
        overTextField,
        hovering: Boolean(hoverable) && !overTextField,
        invertOnAccent,
      }));
    };

    const handlePointerLeave = () => {
      setState((prev) => ({
        ...prev,
        visible: false,
        hovering: false,
        invertOnAccent: false,
      }));
    };

    const handlePointerEnter = () => {
      setState((prev) => ({ ...prev, visible: true }));
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    document.documentElement.addEventListener("pointerenter", handlePointerEnter);

    return () => {
      document.documentElement.classList.remove(CUSTOM_CURSOR_HTML_CLASS);

      if (rafRef.current != null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave,
      );
      document.documentElement.removeEventListener(
        "pointerenter",
        handlePointerEnter,
      );
    };
  }, []);

  if (!isActive || state.overTextField) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-[9999] transition-opacity duration-200",
        state.visible ? "opacity-100" : "opacity-0",
      )}
      style={{
        transform: `translate3d(${state.x}px, ${state.y}px, 0) translate(-50%, -50%)`,
      }}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full transition-[width,height,background-color,border-color] duration-300 ease-out",
          state.hovering
            ? state.invertOnAccent
              ? "size-10 border-2 border-[#f24a00] bg-[#ffd0bc]/75"
              : "size-10 border-2 border-[#f24a00] bg-[#ffd0bc]/75 dark:border-[#daff02] dark:bg-[#4a5200]/55"
            : state.invertOnAccent
              ? "size-4 bg-[#f24a00]"
              : "size-4 bg-[#f24a00] dark:bg-[#daff02]",
        )}
      >
        {state.hovering ? (
          <span
            className={cn(
              "size-2 rounded-full bg-[#f24a00]",
              !state.invertOnAccent && "dark:bg-[#daff02]",
            )}
          />
        ) : null}
      </div>
    </div>
  );
}
