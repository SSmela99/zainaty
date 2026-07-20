import type { LucideIcon } from "lucide-react";
import {
  BookOpenIcon,
  FileTextIcon,
  LayoutGridIcon,
  ListChecksIcon,
  PaintBucketIcon,
  VideoIcon,
} from "lucide-react";

import type { PublicFreeMaterial } from "@/lib/free-materials/types";

export const FREE_MATERIALS_HERO = {
  eyebrow: "Do pobrania za darmo",
  title: "Darmowe materiały",
  description:
    "E-booki, checklisty, szablony i kolorowanki — wszystko gotowe do pobrania. Bez rejestracji, bez zobowiązań, po prostu dla Ciebie.",
} as const;

type BadgeStyle = {
  label: string;
  className: string;
  Icon: LucideIcon;
};

const BADGE_BY_SLUG: Record<string, BadgeStyle> = {
  "e-booki": {
    label: "E-book",
    className:
      "bg-[#f5a623]/90 text-white dark:bg-[#f5a623]/85 dark:text-zinc-950",
    Icon: BookOpenIcon,
  },
  checklisty: {
    label: "Checklista",
    className:
      "bg-[#2bb673]/90 text-white dark:bg-[#2bb673]/85 dark:text-zinc-950",
    Icon: ListChecksIcon,
  },
  templateki: {
    label: "Szablon",
    className:
      "bg-[#e86b6b]/90 text-white dark:bg-[#e86b6b]/85 dark:text-zinc-950",
    Icon: FileTextIcon,
  },
  kolorowanki: {
    label: "Kolorowanka",
    className:
      "bg-[#8a4fd4]/90 text-white dark:bg-[#8a4fd4]/85 dark:text-zinc-950",
    Icon: PaintBucketIcon,
  },
  wideo: {
    label: "Wideo",
    className:
      "bg-[#0033ff]/90 text-white dark:bg-[#4466ff]/90 dark:text-white",
    Icon: VideoIcon,
  },
};

const DEFAULT_BADGE: BadgeStyle = {
  label: "Materiał",
  className:
    "bg-zinc-800/85 text-white dark:bg-zinc-100/90 dark:text-zinc-950",
  Icon: FileTextIcon,
};

const FILTER_ICON_BY_SLUG: Record<string, LucideIcon> = {
  "e-booki": BookOpenIcon,
  checklisty: ListChecksIcon,
  templateki: FileTextIcon,
  kolorowanki: PaintBucketIcon,
  wideo: VideoIcon,
};

export function getMaterialBadge(
  material: PublicFreeMaterial,
): BadgeStyle {
  if (material.is_video) {
    return BADGE_BY_SLUG.wideo;
  }

  const slug = material.tag?.slug;
  if (slug && BADGE_BY_SLUG[slug]) {
    return BADGE_BY_SLUG[slug];
  }

  return {
    ...DEFAULT_BADGE,
    label: material.tag?.name ?? DEFAULT_BADGE.label,
  };
}

export function getFilterIcon(slug: string | null): LucideIcon {
  if (!slug) return LayoutGridIcon;
  return FILTER_ICON_BY_SLUG[slug] ?? FileTextIcon;
}

export function getDownloadCtaLabel(material: PublicFreeMaterial): string {
  if (material.is_video) {
    return "Obejrzyj wideo";
  }

  const slug = material.tag?.slug;
  switch (slug) {
    case "e-booki":
      return "Pobierz e-book";
    case "checklisty":
      return "Pobierz checklistę";
    case "templateki":
      return "Pobierz szablon";
    case "kolorowanki":
      return "Pobierz kolorowankę";
    default:
      return "Pobierz materiał";
  }
}

export function getYouTubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }

      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed" || parts[0] === "shorts") {
        return parts[1] ?? null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getYouTubeEmbedUrl(url: string | null | undefined): string | null {
  const id = getYouTubeVideoId(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}`;
}
