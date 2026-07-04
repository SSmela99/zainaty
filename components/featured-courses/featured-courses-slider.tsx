"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import type { Course } from "@/lib/courses/types";
import { cn } from "@/lib/utils";

import { FeaturedCourseCard } from "./featured-course-card";

type FeaturedCoursesSliderProps = {
  courses: Course[];
};

function getItemsPerPage(width: number): number {
  if (width >= 1280) return 4;
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
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
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

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

  const pages = useMemo(
    () => chunkCourses(courses, itemsPerPage),
    [courses, itemsPerPage],
  );

  const totalPages = Math.max(1, pages.length);
  const activePage = Math.min(page, totalPages - 1);

  const canGoBack = activePage > 0;
  const canGoForward = activePage < totalPages - 1;

  return (
    <div>
      <div className="relative">
        <div className="-my-4 overflow-x-hidden py-4">
          <div
            className="flex transition-transform duration-500 ease-in-out motion-reduce:transition-none"
            style={{ transform: `translateX(-${activePage * 100}%)` }}
          >
            {pages.map((pageCourses, pageIndex) => (
              <div
                key={pageIndex}
                className="grid w-full min-w-full shrink-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {pageCourses.map((course) => (
                  <div key={course.id} className="pt-2">
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
            onClick={() => setPage((current) => Math.min(current + 1, totalPages - 1))}
            className="absolute top-1/2 -right-4 z-10 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-[#ff4b12] bg-[#f2efe6] text-[#ff4b12] shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:bg-[#ff4b12] hover:text-white md:flex dark:border-[#d7ff00] dark:bg-[#111111] dark:text-[#d7ff00] dark:hover:bg-[#d7ff00] dark:hover:text-zinc-950"
            aria-label="Następne kursy"
          >
            <ChevronRightIcon className="size-5" strokeWidth={2.5} />
          </button>
        ) : null}

        {canGoBack ? (
          <button
            type="button"
            onClick={() => setPage((current) => current - 1)}
            className="absolute top-1/2 -left-4 z-10 hidden size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-[#ff4b12] bg-[#f2efe6] text-[#ff4b12] shadow-sm transition-all duration-300 ease-out hover:scale-105 hover:bg-[#ff4b12] hover:text-white md:flex dark:border-[#d7ff00] dark:bg-[#111111] dark:text-[#d7ff00] dark:hover:bg-[#d7ff00] dark:hover:text-zinc-950"
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
                  ? "w-8 bg-[#ff4b12] dark:bg-[#d7ff00]"
                  : "w-2 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-500",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
