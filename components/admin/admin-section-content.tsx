import { BlogAdminPanel } from "./blog";
import { FaqItemsManager } from "./faq";
import type { AdminSection } from "./admin.utils";

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
  const isFaq = section.id === "faq";
  const isWideSection = isBlog || isFaq;

  return (
    <div
      className={`mx-auto w-full ${isWideSection ? "max-w-6xl" : "max-w-4xl"}`}
    >
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#ffe1cc] dark:bg-[#3a3d10]">
          <Icon
            strokeWidth={2.2}
            className="size-5 text-[#ff4b12] dark:text-[#d7ff00]"
          />
        </div>

        <div>
          <p className="text-[13px] font-bold tracking-[0.22em] text-[#1a4dff] uppercase">
            {section.label}
          </p>
          <h1 className="mt-2 text-3xl leading-[1.1] font-black tracking-[-0.02em] md:text-4xl">
            Edycja{" "}
            <span className="text-[#ff4b12] dark:text-[#d7ff00]">
              {section.label.toLowerCase()}
            </span>
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {section.description}
          </p>
        </div>
      </div>

      {isBlog ? (
        <BlogAdminPanel />
      ) : isFaq ? (
        <FaqItemsManager />
      ) : (
        <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm dark:bg-[#1c1c1c] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <p className="text-xs font-bold tracking-[0.18em] text-[#7c3aed] uppercase dark:text-[#a78bfa]">
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
