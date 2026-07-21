"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { Course } from "@/lib/courses/types";
import { cn } from "@/lib/utils";

import { FeaturedCourseCard } from "./featured-course-card";

type FeaturedCoursesSliderProps = {
  courses: Course[];
};

function getItemsPerPage(width: number): number {
  if (width >= 1280) return 4;
  if (width >= 1024) return 3;
  if (width >= 768) return 2;
  return 1;
}

function chunkCourses(courses: Course[], itemsPerPage: number): Course[][] {
  const pages: Course[][] = [];

  for (let index = 0; index < courses.length; index += itemsPerPage) {
    pages.push(courses.slice(index, index + itemsPerPage));
  }

  return pages;
}

export function FeaturedCoursesSlider({ courses }: FeaturedCoursesSliderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = rootRef.current;

    if (!element) {
      return;
    }

    const updateItemsPerPage = (width: number) => {
      setItemsPerPage(getItemsPerPage(width));
    };

    updateItemsPerPage(element.clientWidth || window.innerWidth);

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width != null) {
        updateItemsPerPage(width);
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
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

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.disconnect();
      },
      isMobile
        ? { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
        : { threshold: 0.2, rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [itemsPerPage]);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const pages = useMemo(
    () =>
      itemsPerPage == null ? [] : chunkCourses(courses, itemsPerPage),
    [courses, itemsPerPage],
  );

  const totalPages = Math.max(1, pages.length);
  const activePage = Math.min(page, totalPages - 1);
  const canGoBack = activePage > 0;
  const canGoForward = activePage < totalPages - 1;

  return (
    <div
      ref={rootRef}
      className={cn(
        "transition-opacity duration-[1.35s] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        itemsPerPage == null || !isVisible ? "opacity-0" : "opacity-100",
      )}
    >
      {itemsPerPage == null ? (
        <div
          aria-hidden
          className="min-h-[320px] rounded-3xl bg-[#ddd2c2]/40 dark:bg-[#1c1c1c]/40"
        />
      ) : (
        <>
          <div className="relative">
            <div className="-my-4 overflow-x-hidden py-4">
              <div
                className="flex w-full transition-transform duration-500 ease-in-out motion-reduce:transition-none"
                style={{ transform: `translateX(-${activePage * 100}%)` }}
              >
                {pages.map((pageCourses, pageIndex) => (
                  <div
                    key={pageIndex}
                    className="grid w-full shrink-0 grow-0 basis-full gap-5"
                    style={{
                      gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))`,
                    }}
                  >
                    {pageCourses.map((course) => (
                      <div key={course.id} className="min-w-0 pt-2">
                        <FeaturedCourseCard course={course} />
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
                className="absolute top-1/2 right-1 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-[#f24a00] bg-[#f1eee5] text-[#f24a00] shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:bg-[#f24a00] hover:text-white md:-right-4 md:size-12 dark:border-[#daff02] dark:bg-[#151414] dark:text-[#daff02] dark:hover:bg-[#daff02] dark:hover:text-zinc-950"
                aria-label="Następne kursy"
              >
                <ChevronRightIcon className="size-5" strokeWidth={2.5} />
              </button>
            ) : null}

            {canGoBack ? (
              <button
                type="button"
                onClick={() => setPage((current) => current - 1)}
                className="absolute top-1/2 left-1 z-10 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-[#f24a00] bg-[#f1eee5] text-[#f24a00] shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:bg-[#f24a00] hover:text-white md:-left-4 md:size-12 dark:border-[#daff02] dark:bg-[#151414] dark:text-[#daff02] dark:hover:bg-[#daff02] dark:hover:text-zinc-950"
                aria-label="Poprzednie kursy"
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
        </>
      )}
    </div>
  );
}
