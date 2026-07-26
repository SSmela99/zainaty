"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, useTransition } from "react";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { deletePackage, listPackages } from "@/app/admin/actions/packages";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminLoading } from "@/components/admin/admin-loading";
import { useScrollAdminPanelWhen } from "@/components/admin/use-scroll-admin-panel";
import {
  AdminMessage,
  AdminPanelCard,
} from "@/components/admin/blog/blog-admin.shared";
import { Button } from "@/components/ui/button";
import {
  formatCoursePrice,
  getCourseDiscountPercent,
  type Course,
} from "@/lib/courses/types";

import { PackageForm } from "./package-form";

export function PackagesManager() {
  const [packages, setPackages] = useState<Course[]>([]);
  const [editingPackage, setEditingPackage] = useState<Course | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [packageToDelete, setPackageToDelete] = useState<Course | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadPackages = useCallback(async () => {
    setIsLoading(true);
    const result = await listPackages();

    if (result.ok) {
      setPackages(result.data);
      setError(null);
    } else {
      setError(result.error ?? "Nie udało się wczytać pakietów.");
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadPackages();
  }, [loadPackages]);

  function closeForm() {
    setEditingPackage(null);
    setIsCreating(false);
  }

  function handleSaved() {
    toast.success(editingPackage ? "Pakiet zaktualizowany." : "Pakiet dodany.");
    setError(null);
    closeForm();
    void loadPackages();
  }

  function confirmDelete() {
    if (!packageToDelete) return;

    const id = packageToDelete.id;
    setError(null);

    startTransition(async () => {
      const result = await deletePackage(id);
      if (!result.ok) {
        setError(result.error ?? "Nie udało się usunąć pakietu.");
        return;
      }

      setPackageToDelete(null);
      if (editingPackage?.id === id) closeForm();
      toast.success("Pakiet usunięty.");
      await loadPackages();
    });
  }

  const showForm = isCreating || editingPackage != null;

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
            className="h-10 bg-[#f24a00] px-5 text-white hover:bg-[#d94200] dark:bg-[#daff02] dark:text-black dark:hover:bg-[#9bec00]"
          >
            <PlusIcon />
            Nowy pakiet
          </Button>
        </div>
      ) : null}

      {showForm ? (
        <AdminPanelCard>
          <h2 className="text-lg font-black tracking-[0.02em]">
            {editingPackage ? "Edytuj pakiet" : "Nowy pakiet"}
          </h2>
          <div className="mt-6">
            <PackageForm
              key={editingPackage?.id ?? "new"}
              coursePackage={editingPackage}
              onSaved={handleSaved}
              onCancel={closeForm}
            />
          </div>
        </AdminPanelCard>
      ) : null}

      {error ? <AdminMessage error={error} /> : null}

      <AdminPanelCard>
        <h2 className="text-lg font-black tracking-[0.02em]">Lista — pakiety</h2>

        {isLoading ? (
          <AdminLoading label="Wczytywanie: pakiety..." />
        ) : packages.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">
            Brak pakietów. Dodaj pierwszy pakiet powyżej.
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {packages.map((coursePackage) => {
              const discountPercent = getCourseDiscountPercent(
                coursePackage.price,
                coursePackage.discount_price,
              );

              return (
                <li
                  key={coursePackage.id}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-100 p-4 dark:border-zinc-800 md:flex-row md:items-start"
                >
                  {coursePackage.cover_image_url ? (
                    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl md:w-40">
                      <Image
                        src={coursePackage.cover_image_url}
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
                        {coursePackage.title}
                      </h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase ${
                          coursePackage.published
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}
                      >
                        {coursePackage.published ? "Opublikowany" : "Szkic"}
                      </span>
                      {discountPercent != null ? (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700 dark:bg-red-950/40 dark:text-red-300">
                          -{discountPercent}%
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-1 text-xs text-zinc-500">
                      /{coursePackage.slug}
                    </p>

                    <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                      {coursePackage.discount_price != null ? (
                        <>
                          <span className="font-bold text-[#f24a00] dark:text-[#daff02]">
                            {formatCoursePrice(coursePackage.discount_price)}
                          </span>{" "}
                          <span className="text-zinc-400 line-through">
                            {formatCoursePrice(coursePackage.price)}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold">
                          {formatCoursePrice(coursePackage.price)}
                        </span>
                      )}
                    </p>

                    <p className="mt-2 text-xs text-zinc-500">
                      {coursePackage.package_items.length}{" "}
                      {coursePackage.package_items.length === 1
                        ? "kurs w pakiecie"
                        : "kursy/-ów w pakiecie"}
                    </p>

                    {coursePackage.package_items.length > 0 ? (
                      <p className="mt-1 text-xs text-zinc-500">
                        {coursePackage.package_items
                          .map((item) => item.title)
                          .join(", ")}
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
                        setEditingPackage(coursePackage);
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
                      onClick={() => setPackageToDelete(coursePackage)}
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
        open={packageToDelete != null}
        onOpenChange={(open) => {
          if (!open && !isPending) setPackageToDelete(null);
        }}
        title="Usunąć pakiet?"
        description={
          packageToDelete
            ? `Czy na pewno chcesz usunąć pakiet „${packageToDelete.title}"? Tej operacji nie można cofnąć.`
            : ""
        }
        onConfirm={confirmDelete}
        isPending={isPending}
      />
    </div>
  );
}
