export const CURSOR_COLOR_LIGHT = "#ff4b12";
export const CURSOR_COLOR_DARK = "#d7ff00";

export const HOVERABLE_SELECTOR =
  'a[href], button:not(:disabled), [role="button"]:not([aria-disabled="true"]), input[type="submit"], input[type="button"], input[type="reset"], label[for], select, summary, [data-cursor-label]';

export const TEXT_FIELD_SELECTOR =
  'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]), textarea, [contenteditable="true"]';

export const CUSTOM_CURSOR_HTML_CLASS = "custom-cursor-active";

export function shouldUseCustomCursor() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(pointer: fine)").matches;
}

export function findHoverableElement(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }

  if (target.closest(TEXT_FIELD_SELECTOR)) {
    return null;
  }

  return target.closest(HOVERABLE_SELECTOR) as HTMLElement | null;
}
