"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, useTransition } from "react";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { deleteCourse, listCourses } from "@/app/admin/actions/courses";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminLoading } from "@/components/admin/admin-loading";
import { adminSectionBodyClassName } from "@/components/admin/admin.utils";
import { useScrollAdminPanelWhen } from "@/components/admin/use-scroll-admin-panel";
import { AdminMessage, AdminPanelCard } from "@/components/admin/blog/blog-admin.shared";
import { Button } from "@/components/ui/button";
import {
  COURSE_KIND_LABELS,
  COURSE_KIND_SINGULAR,
  type CourseKind,
} from "@/lib/courses/kinds";
import {
  formatCoursePrice,
  getCourseDiscountPercent,
  type Course,
} from "@/lib/courses/types";

import { CourseForm } from "./course-form";

type CoursesManagerProps = {
  kind: CourseKind;
};

export function CoursesManager({ kind }: CoursesManagerProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    const result = await listCourses(kind);

    if (result.ok && result.data) {
      setCourses(result.data);
      setError(null);
    } else {
      setError(result.error ?? "Nie udało się wczytać kursów.");
    }

    setIsLoading(false);
  }, [kind]);

  useEffect(() => {
    void loadCourses();
  }, [loadCourses]);

  function closeForm() {
    setEditingCourse(null);
    setIsCreating(false);
  }

  function handleSaved() {
    toast.success(editingCourse ? "Kurs zaktualizowany." : "Kurs dodany.");
    setError(null);
    closeForm();
    void loadCourses();
  }

  function requestDelete(course: Course) {
    setCourseToDelete(course);
  }

  function confirmDelete() {
    if (!courseToDelete) return;

    const id = courseToDelete.id;
    setError(null);

    startTransition(async () => {
      const result = await deleteCourse(id);
      if (!result.ok) {
        setError(result.error ?? "Nie udało się usunąć kursu.");
        return;
      }

      setCourseToDelete(null);
      if (editingCourse?.id === id) closeForm();
      toast.success("Kurs usunięty.");
      await loadCourses();
    });
  }

  const showForm = isCreating || editingCourse != null;

  useScrollAdminPanelWhen(showForm);

  return (
    <div className="space-y-6">
      {!showForm ? (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => {
              setIsCreating(true);
              setError(null);
            }}
            className="h-10 bg-[#ff4b12] px-5 text-white hover:bg-[#e6430f] dark:bg-[#d7ff00] dark:text-black dark:hover:bg-[#c4eb00]"
          >
            <PlusIcon />
            Nowe {COURSE_KIND_SINGULAR[kind]}
          </Button>
        </div>
      ) : null}

      {showForm ? (
        <AdminPanelCard>
          <h2 className="text-lg font-black tracking-[-0.02em]">
            {editingCourse ? `Edytuj ${COURSE_KIND_SINGULAR[kind]}` : `Nowe ${COURSE_KIND_SINGULAR[kind]}`}
          </h2>
          <div className="mt-6">
            <CourseForm
              key={editingCourse?.id ?? "new"}
              course={editingCourse}
              kind={kind}
              onSaved={handleSaved}
              onCancel={closeForm}
            />
          </div>
        </AdminPanelCard>
      ) : null}

      {error ? <AdminMessage error={error} /> : null}

      <AdminPanelCard>
        <h2 className="text-lg font-black tracking-[-0.02em]">
          Lista — {COURSE_KIND_LABELS[kind].toLowerCase()}
        </h2>

        {isLoading ? (
          <AdminLoading label={`Wczytywanie: ${COURSE_KIND_LABELS[kind].toLowerCase()}...`} />
        ) : courses.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">
            Brak pozycji w tej zakładce.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {courses.map((course) => {
              const discountPercent = getCourseDiscountPercent(
                course.price,
                course.discount_price,
              );

              return (
                <li
                  key={course.id}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-100 p-4 dark:border-zinc-800 md:flex-row md:items-start"
                >
                  {course.cover_image_url ? (
                    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl md:w-40">
                      <Image
                        src={course.cover_image_url}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : null}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-zinc-950 dark:text-white">
                        {course.title}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase ${
                          course.published
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {course.published ? "Opublikowany" : "Szkic"}
                      </span>
                      {discountPercent != null ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">
                          -{discountPercent}%
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-1 text-xs text-zinc-500">/{course.slug}</p>

                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                      {course.discount_price != null ? (
                        <>
                          <span className="font-bold text-[#ff4b12] dark:text-[#d7ff00]">
                            {formatCoursePrice(course.discount_price)}
                          </span>{" "}
                          <span className="text-zinc-400 line-through">
                            {formatCoursePrice(course.price)}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold">
                          {formatCoursePrice(course.price)}
                        </span>
                      )}
                    </p>

                    {course.duration_label ? (
                      <p className="mt-2 text-xs text-zinc-500">
                        {course.duration_label} · {course.format_label}
                      </p>
                    ) : null}

                    {course.files.length > 0 ? (
                      <p className="mt-2 text-xs text-zinc-500">
                        {course.files.length}{" "}
                        {course.files.length === 1 ? "plik R2" : "pliki R2"}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => {
                        setEditingCourse(course);
                        setIsCreating(false);
                        setError(null);
                      }}
                    >
                      <PencilIcon />
                      Edytuj
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={isPending}
                      onClick={() => requestDelete(course)}
                    >
                      <Trash2Icon />
                      Usuń
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </AdminPanelCard>

      <AdminConfirmDialog
        open={courseToDelete != null}
        onOpenChange={(open) => {
          if (!open && !isPending) setCourseToDelete(null);
        }}
        title="Usunąć kurs?"
        description={
          courseToDelete
            ? `Czy na pewno chcesz usunąć kurs „${courseToDelete.title}"? Tej operacji nie można cofnąć.`
            : ""
        }
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
