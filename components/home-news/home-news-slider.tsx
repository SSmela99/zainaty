"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { NewsItem } from "@/lib/news/types";
import { cn } from "@/lib/utils";

import { HomeNewsCard } from "./home-news-card";

type HomeNewsSliderProps = {
  items: NewsItem[];
};

function getItemsPerPage(width: number): number {
  if (width >= 1280) return 4;
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

function chunkItems(items: NewsItem[], itemsPerPage: number): NewsItem[][] {
  const pages: NewsItem[][] = [];

  for (let index = 0; index < items.length; index += itemsPerPage) {
    pages.push(items.slice(index, index + itemsPerPage));
  }

  return pages;
}

export function HomeNewsSlider({ items }: HomeNewsSliderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(getItemsPerPage(window.innerWidth));
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);

    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, []);

  useEffect(() => {
    if (itemsPerPage == null) {
      return;
    }

    const element = rootRef.current;

    if (!element) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.2, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [itemsPerPage]);

  const pages = useMemo(
    () => (itemsPerPage == null ? [] : chunkItems(items, itemsPerPage)),
    [items, itemsPerPage],
  );

  const totalPages = Math.max(1, pages.length);
  const activePage = Math.min(page, totalPages - 1);
  const canGoBack = activePage > 0;
  const canGoForward = activePage < totalPages - 1;

  if (itemsPerPage == null) {
    return (
      <div
        aria-hidden
        className="min-h-[280px] rounded-3xl bg-[#f1eee5]/60 dark:bg-[#1c1c1c]/40"
      />
    );
  }

  return (
    <div
      ref={rootRef}
      className={cn(
        "transition-opacity duration-[1.35s] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="relative">
        <div className="-my-4 overflow-x-hidden py-4">
          <div
            className="flex transition-transform duration-500 ease-in-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${activePage * 100}%)` }}
          >
            {pages.map((pageItems, pageIndex) => (
              <div
                key={pageIndex}
                className="grid w-full min-w-full shrink-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {pageItems.map((item) => (
                  <div key={item.id} className="pt-2">
                    <HomeNewsCard item={item} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {canGoForward ? (
          <button
            type="button"
            onClick={() =>
              setPage((current) => Math.min(current + 1, totalPages - 1))
            }
            className="absolute top-1/2 -right-4 z-10 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#f24a00] text-white shadow-sm transition-all duration-300 ease-out hover:scale-105 md:flex dark:bg-[#daff02] dark:text-zinc-950"
            aria-label="Następne nowości"
          >
            <ChevronRightIcon className="size-5" strokeWidth={2.5} />
          </button>
        ) : null}

        {canGoBack ? (
          <button
            type="button"
            onClick={() => setPage((current) => current - 1)}
            className="absolute top-1/2 -left-4 z-10 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-zinc-300 bg-white text-zinc-500 shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:border-[#f24a00] hover:text-[#f24a00] md:flex dark:border-zinc-600 dark:bg-[#151414] dark:text-zinc-400 dark:hover:border-[#daff02] dark:hover:text-[#daff02]"
            aria-label="Poprzednie nowości"
          >
            <ChevronLeftIcon className="size-5" strokeWidth={2.5} />
          </button>
        ) : null}
      </div>

      {totalPages > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setPage(index)}
              aria-label={`Slajd ${index + 1}`}
              aria-current={activePage === index ? "true" : undefined}
              className={cn(
                "h-2 cursor-pointer rounded-full transition-all duration-300 ease-out",
                activePage === index
                  ? "w-8 bg-[#f24a00] dark:bg-[#daff02]"
                  : "w-2 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-500",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
