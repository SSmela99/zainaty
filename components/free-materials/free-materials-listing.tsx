"use client";

import Link from "next/link";
import { useState } from "react";
import { LinkIcon } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { PATHS } from "@/lib/paths";
import {
  FREE_MATERIALS_LINKS_VIEW,
  type FreeMaterialLink,
  type FreeMaterialTag,
  type PublicFreeMaterial,
} from "@/lib/free-materials/types";
import { cn } from "@/lib/utils";

import { FreeMaterialCard } from "./free-material-card";
import { FreeMaterialDialog } from "./free-material-dialog";
import { FreeMaterialLinksList } from "./free-material-links-list";
import { getFilterIcon } from "./free-materials.utils";

type FreeMaterialsListingProps = {
  materials: PublicFreeMaterial[];
  links: FreeMaterialLink[];
  tags: FreeMaterialTag[];
  activeTagSlug: string | null;
  linksViewActive: boolean;
};

function listingHref(tagSlug: string | null): string {
  if (!tagSlug) return PATHS.FREE_MATERIALS;
  return `${PATHS.FREE_MATERIALS}?tag=${encodeURIComponent(tagSlug)}`;
}

function linksHref(): string {
  return `${PATHS.FREE_MATERIALS}?view=${FREE_MATERIALS_LINKS_VIEW}`;
}

export function FreeMaterialsListing({
  materials,
  links,
  tags,
  activeTagSlug,
  linksViewActive,
}: FreeMaterialsListingProps) {
  const [selected, setSelected] = useState<PublicFreeMaterial | null>(null);
  const [open, setOpen] = useState(false);

  function handleOpen(material: PublicFreeMaterial) {
    setSelected(material);
    setOpen(true);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setSelected(null);
    }
  }

  return (
    <div>
      <Reveal y={20} delay={0.05}>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <FilterChip
            href={listingHref(null)}
            label="Wszystkie"
            slug={null}
            active={!linksViewActive && activeTagSlug == null}
          />
          {tags.map((tag) => (
            <FilterChip
              key={tag.id}
              href={listingHref(tag.slug)}
              label={tag.name}
              slug={tag.slug}
              active={!linksViewActive && activeTagSlug === tag.slug}
            />
          ))}
          <FilterChip
            href={linksHref()}
            label="Linki"
            slug={FREE_MATERIALS_LINKS_VIEW}
            active={linksViewActive}
            Icon={LinkIcon}
          />
        </div>
      </Reveal>

      {linksViewActive ? (
        <FreeMaterialLinksList links={links} />
      ) : materials.length === 0 ? (
        <p className="mt-12 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {activeTagSlug
            ? "Brak materiałów w wybranej kategorii."
            : "Wkrótce pojawią się tu darmowe materiały."}
        </p>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {materials.map((material, index) => (
            <li key={material.id}>
              <Reveal delay={index * 0.08} className="h-full">
                <FreeMaterialCard material={material} onOpen={handleOpen} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}

      <FreeMaterialDialog
        material={selected}
        open={open}
        onOpenChange={handleOpenChange}
      />
    </div>
  );
}

function FilterChip({
  href,
  label,
  slug,
  active,
  Icon: IconProp,
}: {
  href: string;
  label: string;
  slug: string | null;
  active: boolean;
  Icon?: typeof LinkIcon;
}) {
  const Icon = IconProp ?? getFilterIcon(slug);

  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-all",
        active
          ? "bg-white text-zinc-950 shadow-[0_8px_24px_rgba(0,0,0,0.08)] ring-1 ring-zinc-200/80 dark:bg-[#1c1c1c] dark:text-white dark:shadow-[0_8px_28px_rgba(0,0,0,0.4)] dark:ring-zinc-700"
          : "bg-[#ebe6dc] text-zinc-700 hover:bg-[#e2ddd2] dark:bg-[#242424] dark:text-zinc-300 dark:hover:bg-[#2e2e2e]",
      )}
    >
      <Icon className="size-4" strokeWidth={2.3} />
      {label}
    </Link>
  );
}
