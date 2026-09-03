"use client";

import { openCookieSettings } from "@/lib/cookies/consent";

type CookieSettingsButtonProps = {
  className?: string;
};

export function CookieSettingsButton({
  className,
}: CookieSettingsButtonProps) {
  return (
    <button
      type="button"
      onClick={() => openCookieSettings()}
      className={className}
    >
      Ustawienia cookies
    </button>
  );
}
