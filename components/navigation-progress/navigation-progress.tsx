"use client";

import NextTopLoader from "nextjs-toploader";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function NavigationProgress() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const color = resolvedTheme === "dark" ? "#d7ff00" : "#ff4b12";

  return (
    <NextTopLoader
      color={color}
      height={3}
      showSpinner={false}
      shadow={false}
      crawlSpeed={200}
      speed={300}
      zIndex={49}
    />
  );
}
