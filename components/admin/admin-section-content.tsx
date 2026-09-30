"use client";

import dynamic from "next/dynamic";

import { AdminLoading } from "./admin-loading";
import { adminContentClassName, adminSectionBodyClassName } from "./admin.utils";
import type { AdminSection } from "./admin.utils";

const sectionLoading = <AdminLoading label="Wczytywanie sekcji..." />;

const BlogAdminPanel = dynamic(
  () => import("./blog/blog-admin-panel").then((mod) => mod.BlogAdminPanel),
  { loading: () => sectionLoading },
);
const CoursesAdminPanel = dynamic(
  () => import("./courses/courses-admin-panel").then((mod) => mod.CoursesAdminPanel),
  { loading: () => sectionLoading },
);
const FreeMaterialsAdminPanel = dynamic(
  () =>
    import("./free-materials/free-materials-admin-panel").then(
      (mod) => mod.FreeMaterialsAdminPanel,
    ),
  { loading: () => sectionLoading },
);
const R2FilesManager = dynamic(
  () => import("./r2-files/r2-files-manager").then((mod) => mod.R2FilesManager),
  { loading: () => sectionLoading },
);
const DiscountCodesManager = dynamic(
  () =>
    import("./discount-codes/discount-codes-manager").then(
      (mod) => mod.DiscountCodesManager,
    ),
  { loading: () => sectionLoading },
);
const FaqItemsManager = dynamic(
  () => import("./faq/faq-items-manager").then((mod) => mod.FaqItemsManager),
  { loading: () => sectionLoading },
);
const TestimonialsManager = dynamic(
  () =>
    import("./testimonials/testimonials-manager").then(
      (mod) => mod.TestimonialsManager,
    ),
  { loading: () => sectionLoading },
);
const ConsultationsAdminPanel = dynamic(
  () =>
    import("./consultations/consultations-admin-panel").then(
      (mod) => mod.ConsultationsAdminPanel,
    ),
  { loading: () => sectionLoading },
);
const FooterSettingsManager = dynamic(
  () =>
    import("./footer/footer-settings-manager").then(
      (mod) => mod.FooterSettingsManager,
    ),
  { loading: () => sectionLoading },
);
const UsersManager = dynamic(
  () => import("./users/users-manager").then((mod) => mod.UsersManager),
  { loading: () => sectionLoading },
);

type AdminSectionContentProps = {
  section: AdminSection;
  userEmail: string;
};

export function AdminSectionContent({
  section,
  userEmail,
}: AdminSectionContentProps) {
  const Icon = section.icon;
  const isBlog = section.id === "blog";
  const isCourses = section.id === "courses";
  const isFreeMaterials = section.id === "free-materials";
  const isFiles = section.id === "files";
  const isDiscountCodes = section.id === "discount-codes";
  const isFaq = section.id === "faq";
  const isTestimonials = section.id === "testimonials";
  const isConsultations = section.id === "consultations";
  const isFooter = section.id === "footer";
  const isUsers = section.id === "users";

  return (
    <div className={adminContentClassName}>
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#ffd0bc] dark:bg-[#3a4500]">
          <Icon
            strokeWidth={2.2}
            className="size-5 text-[#f24a00] dark:text-[#daff02]"
          />
        </div>

        <div>
          <p className="text-[13px] font-bold tracking-[0.22em] text-[#0033ff] uppercase">
            {section.label}
          </p>
          <h1 className="mt-2 text-3xl leading-[1.1] font-black tracking-[0.02em] md:text-4xl">
            {isUsers ? (
              <>
                Lista{" "}
                <span className="text-[#f24a00] dark:text-[#daff02]">
                  użytkowników
                </span>
              </>
            ) : isFiles ? (
              <>
                Biblioteka{" "}
                <span className="text-[#f24a00] dark:text-[#daff02]">
                  plików
                </span>
              </>
            ) : (
              <>
                Edycja{" "}
                <span className="text-[#f24a00] dark:text-[#daff02]">
                  {section.label.toLowerCase()}
                </span>
              </>
            )}
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {section.description}
          </p>
        </div>
      </div>

      {isBlog ? (
        <BlogAdminPanel />
      ) : isCourses ? (
        <CoursesAdminPanel />
      ) : isFreeMaterials ? (
        <FreeMaterialsAdminPanel />
      ) : isFiles ? (
        <R2FilesManager />
      ) : isDiscountCodes ? (
        <DiscountCodesManager />
      ) : isFaq ? (
        <FaqItemsManager />
      ) : isTestimonials ? (
        <TestimonialsManager />
      ) : isConsultations ? (
        <ConsultationsAdminPanel />
      ) : isFooter ? (
        <FooterSettingsManager />
      ) : isUsers ? (
        <UsersManager />
      ) : (
        <div
          className={`${adminSectionBodyClassName} rounded-3xl bg-white p-8 shadow-sm dark:bg-[#1c1c1c] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]`}
        >
          <p className="text-xs font-bold tracking-[0.18em] text-[#6b1cb1] uppercase dark:text-[#b57ae0]">
            Wkrótce
          </p>
          <p className="mt-4 text-base leading-7 text-zinc-700 dark:text-zinc-300">
            Tutaj pojawią się pola do edycji treści sekcji{" "}
            <strong className="font-bold text-zinc-950 dark:text-white">
              {section.label}
            </strong>
            . Zalogowano jako {userEmail}.
          </p>
        </div>
      )}
    </div>
  );
}
