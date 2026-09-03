"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import {
  ARROW_CURSOR,
  CURSOR_BORDER_COLOR,
  getCursorHotspot,
  POINTER_HAND_CURSOR,
} from "./custom-cursor.icons";
import {
  CUSTOM_CURSOR_HTML_CLASS,
  findHoverableElement,
  shouldUseCustomCursor,
} from "./custom-cursor.utils";

type CursorState = {
  x: number;
  y: number;
  visible: boolean;
  overTextField: boolean;
  isPointer: boolean;
};

const INITIAL_STATE: CursorState = {
  x: -100,
  y: -100,
  visible: false,
  overTextField: false,
  isPointer: false,
};

const CURSOR_FILL_CLASS = "fill-[#b57ae0] dark:fill-[#f24a00]";
const CURSOR_HAND_STROKE_WIDTH = 2.5;

function ArrowCursorIcon() {
  const { size, viewBox, innerPath, outlinePath } = ARROW_CURSOR;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d={innerPath} className={CURSOR_FILL_CLASS} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={outlinePath}
        fill={CURSOR_BORDER_COLOR}
      />
    </svg>
  );
}

function PointerHandIcon() {
  const { size, viewBox, path, innerPath } = POINTER_HAND_CURSOR;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d={path} className={CURSOR_FILL_CLASS} />
      <path d={innerPath} className={CURSOR_FILL_CLASS} />
      <path
        d={path}
        fill="none"
        stroke={CURSOR_BORDER_COLOR}
        strokeWidth={CURSOR_HAND_STROKE_WIDTH}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CustomCursor() {
  const [isActive, setIsActive] = useState(false);
  const [state, setState] = useState<CursorState>(INITIAL_STATE);

  useEffect(() => {
    if (!shouldUseCustomCursor()) {
      return;
    }

    setIsActive(true);
    document.documentElement.classList.add(CUSTOM_CURSOR_HTML_CLASS);

    const handlePointerMove = (event: PointerEvent) => {
      const overTextField =
        event.target instanceof Element &&
        Boolean(
          event.target.closest("input, textarea, [contenteditable='true']"),
        );

      const hoverable = findHoverableElement(event.target);

      setState({
        x: event.clientX,
        y: event.clientY,
        visible: true,
        overTextField,
        isPointer: Boolean(hoverable) && !overTextField,
      });
    };

    const handlePointerLeave = () => {
      setState((prev) => ({
        ...prev,
        visible: false,
        isPointer: false,
      }));
    };

    const handlePointerEnter = () => {
      setState((prev) => ({ ...prev, visible: true }));
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.documentElement.addEventListener(
      "pointerleave",
      handlePointerLeave,
    );
    document.documentElement.addEventListener(
      "pointerenter",
      handlePointerEnter,
    );

    return () => {
      document.documentElement.classList.remove(CUSTOM_CURSOR_HTML_CLASS);

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

  const cursor = state.isPointer ? POINTER_HAND_CURSOR : ARROW_CURSOR;
  const hotspot = getCursorHotspot(cursor);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed top-0 left-0 z-[9999] transition-opacity duration-150",
        state.visible ? "opacity-100" : "opacity-0",
      )}
      style={{
        transform: `translate3d(${state.x - hotspot.x}px, ${state.y - hotspot.y}px, 0)`,
      }}
    >
      {state.isPointer ? <PointerHandIcon /> : <ArrowCursorIcon />}
    </div>
  );
}
