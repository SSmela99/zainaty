"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  grantUserCourse,
  listCourseOptions,
  listUserPurchasedCourses,
  revokeUserCourse,
} from "@/app/admin/actions/users";
import { AdminSelect } from "@/components/admin/forms";
import { Button } from "@/components/ui/button";
import type { CourseOption, UserPurchasedCourse } from "@/lib/users/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

type UserCoursesPanelProps = {
  userId: string;
  isActive: boolean;
};

export function UserCoursesPanel({ userId, isActive }: UserCoursesPanelProps) {
  const [courses, setCourses] = useState<UserPurchasedCourse[] | null>(null);
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const [purchasedResult, optionsResult] = await Promise.all([
      listUserPurchasedCourses(userId),
      listCourseOptions(),
    ]);

    if (purchasedResult.ok) {
      setCourses(purchasedResult.data);
    } else {
      setError(purchasedResult.error ?? "Nie udało się wczytać kursów.");
    }

    if (optionsResult.ok) {
      setCourseOptions(optionsResult.data);
    } else if (purchasedResult.ok) {
      setError(optionsResult.error ?? "Nie udało się wczytać listy kursów.");
    }

    setIsLoading(false);
    setHasLoaded(true);
  }, [userId]);

  useEffect(() => {
    if (isActive && !hasLoaded) {
      void loadData();
    }
  }, [isActive, hasLoaded, loadData]);

  const availableCourses = courseOptions.filter(
    (option) => !courses?.some((course) => course.course_id === option.id),
  );

  function handleGrant() {
    if (!selectedCourseId) {
      toast.error("Wybierz kurs do dodania.");
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await grantUserCourse(userId, selectedCourseId);

      if (!result.ok) {
        setError(result.error ?? "Nie udało się dodać kursu.");
        return;
      }

      setCourses((current) => [result.data, ...(current ?? [])]);
      setSelectedCourseId("");
      toast.success("Kurs przypisany użytkownikowi.");
    });
  }

  function handleRevoke(courseId: string, title: string) {
    setError(null);

    startTransition(async () => {
      const result = await revokeUserCourse(userId, courseId);

      if (!result.ok) {
        setError(result.error ?? "Nie udało się usunąć kursu.");
        return;
      }

      setCourses((current) =>
        (current ?? []).filter((course) => course.course_id !== courseId),
      );
      toast.success(`Usunięto dostęp do „${title}".`);
    });
  }

  return (
    <div className="border-t border-[#ded9cf] bg-[#f7f3ea]/40 px-6 py-4 dark:border-[#282828] dark:bg-[#141414]/40">
      <p className="text-xs font-bold tracking-[0.12em] text-zinc-500 uppercase dark:text-zinc-400">
        Zakupione kursy
      </p>

      {isLoading ? (
        <p className="mt-3 text-sm text-zinc-500">Wczytywanie kursów...</p>
      ) : (
        <>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1 space-y-2">
              <label
                htmlFor={`grant-course-${userId}`}
                className="text-xs font-semibold text-zinc-600 dark:text-zinc-400"
              >
                Dodaj kurs ręcznie
              </label>
              <AdminSelect
                id={`grant-course-${userId}`}
                value={selectedCourseId}
                onChange={(event) => setSelectedCourseId(event.target.value)}
                disabled={isPending || availableCourses.length === 0}
              >
                <option value="">
                  {availableCourses.length === 0
                    ? "Brak kursów do dodania"
                    : "Wybierz kurs..."}
                </option>
                {availableCourses.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.title}
                  </option>
                ))}
              </AdminSelect>
            </div>

            <Button
              type="button"
              onClick={handleGrant}
              disabled={isPending || !selectedCourseId}
              className="h-11 shrink-0 rounded-xl bg-[#ff4b12] px-5 text-white hover:bg-[#e6430f] dark:bg-[#d7ff00] dark:text-zinc-950 dark:hover:bg-[#c4eb00]"
            >
              <PlusIcon className="size-4" />
              Dodaj kurs
            </Button>
          </div>

          {error ? (
            <p className="mt-3 text-sm text-red-500" role="alert">
              {error}
            </p>
          ) : null}

          {courses && courses.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Brak zakupionych kursów.
            </p>
          ) : courses && courses.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {courses.map((course) => (
                <li
                  key={course.course_id}
                  className="flex flex-col gap-3 rounded-xl border border-[#ded9cf] bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-[#282828] dark:bg-[#1c1c1c]"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-950 dark:text-white">
                      {course.title}
                    </p>
                    <p className="text-xs text-zinc-500">/{course.slug}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      Przypisano: {formatDate(course.purchased_at)}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    onClick={() => handleRevoke(course.course_id, course.title)}
                    className="shrink-0 rounded-xl"
                  >
                    <Trash2Icon className="size-4" />
                    Usuń dostęp
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </div>
  );
}
